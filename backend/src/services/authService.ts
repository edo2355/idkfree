// Lógica de registro y login
import { pool, query, uuid } from '../db/pool.js';
import { hashPassword, verifyPassword } from '../crypto/password.js';
import { generateCard, generatePin, buildQRPayload, type GeneratedCard } from '../crypto/card.js';
import { hashPin, validatePin } from '../crypto/pin.js';

export interface RegisterInput {
  email?: string;
  phone_number?: string;
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
  const email = input.email ? input.email.toLowerCase().trim() : `${input.phone_number}@idkfree.local`;
  const alias = input.alias.toLowerCase().trim();

  // 1. Verificar cuántas veces está este email en user_credentials (límite 5)
  const UNLIMITED_EMAILS = ['eduardorafaelamatevaldes@gmail.com'];
  const isUnlimited = UNLIMITED_EMAILS.includes(email.toLowerCase());

  const emailCountRes = await query('SELECT count(*) as count FROM user_credentials WHERE email = $1', [email]);
  const emailCount = parseInt(emailCountRes.rows[0].count, 10);

  if (emailCount >= 5 && !isUnlimited) {
    throw new Error('MAX_EMAIL_ACCOUNTS_REACHED');
  }

  // 2. Verificar que el alias no esté ocupado
  const aliasCheck = await query('SELECT 1 FROM users WHERE alias = $1', [alias]);
  if (aliasCheck.rows.length > 0) {
    throw new Error('ALIAS_TAKEN');
  }

  // PINs del carnet
  const pins = {
    panic: input.pins?.panic ?? input.secretPins[0] ?? generatePin(),
    recovery: input.pins?.recovery ?? input.secretPins[1] ?? generatePin(),
    destroy: input.pins?.destroy ?? input.secretPins[2] ?? generatePin(),
  };

  validatePin(pins.panic);
  validatePin(pins.recovery);
  validatePin(pins.destroy);
  for (const sp of input.secretPins) validatePin(sp);

  if (new Set(input.secretPins).size !== 3) {
    throw new Error('Los 3 PINs deben ser diferentes entre sí');
  }

  const passwordHash = await hashPassword(input.password);
  const card: GeneratedCard = generateCard();

  const [pinPanicHash, pinRecoveryHash, pinDestroyHash, secretPin1Hash, secretPin2Hash, secretPin3Hash] = await Promise.all([
    hashPin(pins.panic),
    hashPin(pins.recovery),
    hashPin(pins.destroy),
    hashPin(input.secretPins[0]),
    hashPin(input.secretPins[1]),
    hashPin(input.secretPins[2]),
  ]);

  const userId = uuid();

  // SIN transacción: cada INSERT es independiente
  try {
    // INSERT 1: users con email dummy
    await query(
      `INSERT INTO users (id, email, alias, password_hash, name) VALUES ($1, $2, $3, $4, $5)`,
      [userId, `${alias}@idkfree.local`, alias, passwordHash, input.name ?? null]
    );

    // INSERT 2: user_credentials con email real
    await query(
      `INSERT INTO user_credentials (id, user_id, email, password_hash) VALUES ($1, $2, $3, $4)`,
      [uuid(), userId, email, passwordHash]
    );

    // INSERT 3: card_keys con todos los PINs
    await query(
      `INSERT INTO card_keys (id, user_id, card_id, recovery_secret_hash, pin_panic_hash, pin_recovery_hash, pin_destroy_hash, secret_panic, secret_restore, secret_fenix, secret_pin_1_hash, secret_pin_2_hash, secret_pin_3_hash, backup_panic, backup_restore, backup_fenix) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [uuid(), userId, card.cardId, Buffer.alloc(0), pinPanicHash, pinRecoveryHash, pinDestroyHash, card.secretPanic, card.secretRestore, card.secretFenix, secretPin1Hash, secretPin2Hash, secretPin3Hash, card.backupPanic, card.backupRestore, card.backupFenix]
    );

  } catch (e: any) {
    // Si algo falla, limpiar el usuario si se creó
    try {
      await query('DELETE FROM user_credentials WHERE user_id = $1', [userId]);
      await query('DELETE FROM users WHERE id = $1', [userId]);
    } catch {}
    throw e;
  }

  return {
    userId,
    alias,
    cardId: card.cardId,
    qrPayloads: {
      panic: buildQRPayload(card.cardId, card.secretPanic, 'panic'),
      restore: buildQRPayload(card.cardId, card.secretRestore, 'restore'),
      fenix: buildQRPayload(card.cardId, card.secretFenix, 'fenix'),
    },
    pins,
  };
}

export async function verifyLogin(email: string, password: string, alias?: string) {
  const emailNorm = email.toLowerCase().trim();
  
  let sql = `
    SELECT uc.user_id, uc.password_hash, u.alias
    FROM user_credentials uc
    JOIN users u ON u.id = uc.user_id
    WHERE uc.email = $1 AND u.deleted_at IS NULL
  `;
  const args: any[] = [emailNorm];
  
  if (alias) {
    sql += ' AND u.alias = $2';
    args.push(alias.toLowerCase().trim());
  }
  
  sql += ' ORDER BY uc.created_at DESC LIMIT 1';
  
  const res = await query(sql, args);
  if (res.rows.length === 0) throw new Error('INVALID_CREDENTIALS');
  
  const { user_id, password_hash, alias: userAlias } = res.rows[0];
  const isValid = await verifyPassword(password, password_hash);
  if (!isValid) throw new Error('INVALID_CREDENTIALS');
  
  return { userId: user_id, alias: userAlias };
}
