// Servicio de recuperación con los 3 QRs (panic, restore, fenix)
import { query, uuid } from '../db/pool.js';
import { hashPassword } from '../crypto/password.js';
import { verifyPin } from '../crypto/pin.js';

type Kind = 'panic' | 'restore' | 'fenix';

interface RecoverInput {
  cardId: string;
  secret: string;
  pin: string;
}

interface RestoreInput extends RecoverInput {
  newPassword: string;
}

/**
 * Busca el usuario por cardId y verifica:
 *  - el secret del QR coincide con el tipo (panic/restore/fenix)
 *  - el PIN del carnet coincide con el correspondiente
 */
async function verifyCardSecrets(
  kind: Kind,
  input: RecoverInput
): Promise<{ userId: string; alias: string }> {
  const secretCol = `secret_${kind}`;
  const pinHashCol = kind === 'panic'
    ? 'pin_panic_hash'
    : kind === 'restore'
    ? 'pin_recovery_hash'
    : 'pin_destroy_hash';

  const res = await query<{
    user_id: string;
    alias: string;
    secret: string;
    pin_hash: Buffer;
  }>(
    `SELECT ck.user_id, u.alias, ck.${secretCol} AS secret, ck.${pinHashCol} AS pin_hash
     FROM card_keys ck
     JOIN users u ON u.id = ck.user_id
     WHERE ck.card_id = $1`,
    [input.cardId]
  );

  if (res.rows.length === 0) throw new Error('INVALID_CARD');

  const row = res.rows[0];
  if (row.secret !== input.secret) throw new Error('INVALID_QR');
  const pinOk = await verifyPin(row.pin_hash, input.pin);
  if (!pinOk) throw new Error('INVALID_PIN');

  return { userId: row.user_id, alias: row.alias };
}

/** QR Pánico — bloquea la cuenta temporalmente */
export async function panicRecover(input: RecoverInput) {
  const { userId, alias } = await verifyCardSecrets('panic', input);

  // Marca al usuario como "bloqueado por pánico"
  // (usamos deleted_at por ahora — la app filtra por requireAlive)
  await query(
    `UPDATE users SET deleted_at = datetime('now') WHERE id = $1`,
    [userId]
  );

  return { userId, alias, action: 'panic', message: 'Cuenta bloqueada temporalmente.' };
}

/** QR Restablecer — cambia la contraseña */
export async function restoreRecover(input: RestoreInput) {
  const { userId, alias } = await verifyCardSecrets('restore', input);

  if (input.newPassword.length < 12) {
    throw new Error('WEAK_PASSWORD');
  }

  const newHash = await hashPassword(input.newPassword);
  await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [newHash, userId]);

  return { userId, alias, action: 'restore', message: 'Contraseña restablecida.' };
}

/** QR Fénix — borra la cuenta permanentemente */
export async function fenixRecover(input: RecoverInput) {
  const { userId, alias } = await verifyCardSecrets('fenix', input);

  // Borrado definitivo
  await query(`DELETE FROM users WHERE id = $1`, [userId]);

  return { userId, alias, action: 'fenix', message: 'Cuenta eliminada permanentemente.' };
}

export const __kind = { panic: panicRecover, restore: restoreRecover, fenix: fenixRecover };
