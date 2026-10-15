// Servicio de recuperación con los 3 QRs (panic, restore, fenix)
// Jerarquía: mental > impreso. FÉNIX tiene ventana de 24h.
import { query, uuid } from '../db/pool.js';
import { hashPassword } from '../crypto/password.js';
import { verifyPin } from '../crypto/pin.js';

type Kind = 'panic' | 'restore' | 'fenix';
type Method = 'mental' | 'printed';

interface RecoverInput {
  cardId: string;
  secret: string;
  pin: string; // puede ser el PIN mental O el código impreso de respaldo
  ip?: string;
}

interface RestoreInput extends RecoverInput {
  newPassword: string;
}

/**
 * Verifica secret del QR + (PIN mental OR backup impreso).
 * Devuelve el método usado: 'mental' (fuerte) o 'printed' (débil).
 */
async function verifyCardSecrets(
  kind: Kind,
  input: RecoverInput
): Promise<{ userId: string; alias: string; method: Method }> {
  const secretCol = `secret_${kind}`;
  const backupCol = `backup_${kind}`;
  const pinHashCol = kind === 'panic'
    ? 'pin_panic_hash'
    : kind === 'restore'
    ? 'pin_recovery_hash'
    : 'pin_destroy_hash';

  const res = await query<{
    user_id: string;
    alias: string;
    secret: string;
    backup: string | null;
    pin_hash: Buffer;
  }>(
    `SELECT ck.user_id, u.alias, ck.${secretCol} AS secret, ck.${backupCol} AS backup, ck.${pinHashCol} AS pin_hash
     FROM card_keys ck
     JOIN users u ON u.id = ck.user_id
     WHERE ck.card_id = $1`,
    [input.cardId]
  );

  if (res.rows.length === 0) throw new Error('INVALID_CARD');

  const row = res.rows[0];
  if (row.secret !== input.secret) throw new Error('INVALID_QR');

  // 1. Intentar PIN mental (fuerte)
  const pinOk = await verifyPin(row.pin_hash, input.pin);
  if (pinOk) return { userId: row.user_id, alias: row.alias, method: 'mental' };

  // 2. Fallback a código impreso (débil) — normalizado sin guiones + uppercase
  if (row.backup) {
    const normalize = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (normalize(input.pin) === normalize(row.backup)) {
      return { userId: row.user_id, alias: row.alias, method: 'printed' };
    }
  }

  throw new Error('INVALID_PIN');
}

/** Registra un intento en recovery_audit */
async function auditRecovery(
  cardId: string,
  action: Kind,
  method: Method,
  success: boolean,
  ip?: string
) {
  try {
    await query(
      `INSERT INTO recovery_audit (id, card_id, action, method, success, ip)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuid(), cardId, action, method, success ? 1 : 0, ip ?? null]
    );
  } catch (e) {
    // no romper si falla el audit
  }
}

/** QR Pánico — bloquea la cuenta temporalmente */
export async function panicRecover(input: RecoverInput) {
  try {
    const { userId, alias, method } = await verifyCardSecrets('panic', input);

    await query(
      `UPDATE users SET deleted_at = datetime('now') WHERE id = $1`,
      [userId]
    );

    await auditRecovery(input.cardId, 'panic', method, true, input.ip);

    return {
      userId, alias, action: 'panic' as const, method,
      message: 'Cuenta bloqueada temporalmente.',
      needsOwnerConfirmation: method === 'printed',
    };
  } catch (e) {
    await auditRecovery(input.cardId, 'panic', 'mental', false, input.ip);
    throw e;
  }
}

/** QR Restablecer — cambia la contraseña */
export async function restoreRecover(input: RestoreInput) {
  try {
    const { userId, alias, method } = await verifyCardSecrets('restore', input);

    if (input.newPassword.length < 12) throw new Error('WEAK_PASSWORD');

    const newHash = await hashPassword(input.newPassword);
    await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [newHash, userId]);

    await auditRecovery(input.cardId, 'restore', method, true, input.ip);

    return {
      userId, alias, action: 'restore' as const, method,
      message: 'Contraseña restablecida.',
      needsOwnerConfirmation: method === 'printed',
    };
  } catch (e) {
    await auditRecovery(input.cardId, 'restore', 'mental', false, input.ip);
    throw e;
  }
}

/**
 * QR Fénix — marca la cuenta para borrado en 24h.
 * Si el dueño real usa su PIN mental dentro de esas 24h → cancela el borrado.
 */
export async function fenixRecover(input: RecoverInput) {
  try {
    const { userId, alias, method } = await verifyCardSecrets('fenix', input);

    // NO borrar directo — marcar pending 24h
    await query(
      `UPDATE card_keys
       SET pending_deletion_at = datetime('now', '+24 hours'),
           pending_deletion_kind = $1
       WHERE user_id = $2`,
      [method, userId]
    );

    await auditRecovery(input.cardId, 'fenix', method, true, input.ip);

    return {
      userId, alias, action: 'fenix' as const, method,
      message: 'Cuenta marcada para eliminación en 24 horas.',
      needsOwnerConfirmation: method === 'printed',
      windowHours: 24,
    };
  } catch (e) {
    await auditRecovery(input.cardId, 'fenix', 'mental', false, input.ip);
    throw e;
  }
}

/**
 * Override del dueño: si alguien ejecutó una acción con el código impreso,
 * el dueño puede cancelarla/revertirla usando su PIN mental.
 */
export async function overridePendingDeletion(cardId: string, pin: string, ip?: string) {
  const res = await query<{
    user_id: string;
    alias: string;
    pin_hash: Buffer;
    pending_deletion_at: string | null;
  }>(
    `SELECT ck.user_id, u.alias, ck.pin_panic_hash AS pin_hash, ck.pending_deletion_at
     FROM card_keys ck
     JOIN users u ON u.id = ck.user_id
     WHERE ck.card_id = $1`,
    [cardId]
  );

  if (res.rows.length === 0) throw new Error('INVALID_CARD');
  const row = res.rows[0];

  // El override SOLO acepta PIN mental (fuerte)
  const pinOk = await verifyPin(row.pin_hash, pin);
  if (!pinOk) throw new Error('INVALID_MENTAL_PIN');

  // Cancelar borrado pendiente
  await query(
    `UPDATE card_keys
     SET pending_deletion_at = NULL, pending_deletion_kind = NULL
     WHERE user_id = $1`,
    [row.user_id]
  );

  // Desbloquear cuenta si estaba bloqueada por pánico
  await query(`UPDATE users SET deleted_at = NULL WHERE id = $1`, [row.user_id]);

  await auditRecovery(cardId, 'panic', 'mental', true, ip);

  return {
    userId: row.user_id,
    alias: row.alias,
    message: 'Acción revertida. Cuenta bajo control del dueño.',
    cancelledPending: !!row.pending_deletion_at,
  };
}

/** Devuelve el historial de intentos del carnet */
export async function getRecoveryAudit(cardId: string, limit = 50) {
  const res = await query(
    `SELECT id, action, method, success, ip, created_at
     FROM recovery_audit
     WHERE card_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [cardId, limit]
  );
  return res.rows;
}

export const __kind = { panic: panicRecover, restore: restoreRecover, fenix: fenixRecover };
