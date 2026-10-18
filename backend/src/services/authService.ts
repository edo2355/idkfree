// Lógica de registro y login
import { pool, query, uuid } from '../db/pool.js';
import { hashPassword, verifyPassword } from '../crypto/password.js';
import { generateCard, generatePin, buildQRPayload, type GeneratedCard } from '../crypto/card.js';
import { hashPin, validatePin } from '../crypto/pin.js';

export interface RegisterInput {
  email: string;
  alias: string;
  password: string;
  name?: string;
  pins?: { panic?: string; recovery?: string; destroy?: string };
  secretPins: [string, string, string];
}

export interface RegisterResult {
  userId: string;
  alias: string;
  cardId: string;
  qrPayloads: {
    panic: string;
    restore: string;
    fenix: string;
  };
  pins: {
    panic: string;
    recovery: string;
    destroy: string;
  };
}

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const email = input.email.toLowerCase().trim();
  const alias = input.alias.toLowerCase().trim();

  const existing = await query(
    'SELECT 1 FROM users WHERE email = $1 OR alias = $2',
    [email, alias]
  );
  if (existing.rows.length > 0) {
    throw new Error('EMAIL_OR_ALIAS_TAKEN');
  }

  // PINs del carnet — usar los del usuario o generar
  // Prioridad: input.pins.* > input.secretPins[i] > random
  // La app envía los PINs del usuario como secretPins[0/1/2]
  const pins = {
    panic: input.pins?.panic ?? input.secretPins[0] ?? generatePin(),
    recovery: input.pins?.recovery ?? input.secretPins[1] ?? generatePin(),
    destroy: input.pins?.destroy ?? input.secretPins[2] ?? generatePin(),
  };

  // Validar formato
  validatePin(pins.panic);
  validatePin(pins.recovery);
  validatePin(pins.destroy);
  for (const sp of input.secretPins) validatePin(sp);

  // Verificar que los 3 PINs del usuario sean diferentes entre sí
  // (los 3 impresos se generan aparte y no tienen que ver con estos)
  if (new Set(input.secretPins).size !== 3) {
    throw new Error('Los 3 PINs deben ser diferentes entre sí');
  }

  const passwordHash = await hashPassword(input.password);
  const card: GeneratedCard = generateCard();

  // Hashear los 6 PINs
  const [
    pinPanicHash,
    pinRecoveryHash,
    pinDestroyHash,
    secretPin1Hash,
    secretPin2Hash,
    secretPin3Hash,
  ] = await Promise.all([
    hashPin(pins.panic),
    hashPin(pins.recovery),
    hashPin(pins.destroy),
    hashPin(input.secretPins[0]),
    hashPin(input.secretPins[1]),
    hashPin(input.secretPins[2]),
  ]);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userId = uuid();
    const userRes = await client.query<{ id: string; alias: string }>(
      `INSERT INTO users (id, email, alias, password_hash, name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, alias`,
      [userId, email, alias, passwordHash, input.name ?? null]
    );
    const user = userRes.rows[0] ?? { id: userId, alias };

    await client.query(
      `INSERT INTO card_keys
       (id, user_id, card_id,
        recovery_secret_hash,
        pin_panic_hash, pin_recovery_hash, pin_destroy_hash,
        secret_panic, secret_restore, secret_fenix,
        secret_pin_1_hash, secret_pin_2_hash, secret_pin_3_hash,
        backup_panic, backup_restore, backup_fenix)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        uuid(),
        user.id,
        card.cardId,
        Buffer.alloc(0), // recovery_secret_hash ya no se usa, dejamos vacío
        pinPanicHash,
        pinRecoveryHash,
        pinDestroyHash,
        card.secretPanic,
        card.secretRestore,
        card.secretFenix,
        secretPin1Hash,
        secretPin2Hash,
        secretPin3Hash,
        card.backupPanic,
        card.backupRestore,
        card.backupFenix,
      ]
    );

    await client.query('COMMIT');

    return {
      userId: user.id,
      alias: user.alias,
      cardId: card.cardId,
      qrPayloads: {
        panic: buildQRPayload(card.cardId, card.secretPanic, 'panic'),
        restore: buildQRPayload(card.cardId, card.secretRestore, 'restore'),
        fenix: buildQRPayload(card.cardId, card.secretFenix, 'fenix'),
      },
      pins,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function verifyLogin(
  email: string,
  password: string
): Promise<{ userId: string; alias: string }> {
  const res = await query<{
    id: string;
    alias: string;
    password_hash: string;
  }>(
    'SELECT id, alias, password_hash FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  );

  if (res.rows.length === 0) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const user = res.rows[0];
  const valid = await verifyPassword(user.password_hash, password);
  if (!valid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return { userId: user.id, alias: user.alias };
}
