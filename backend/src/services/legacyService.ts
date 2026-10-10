// ============================================================
// legacyService.ts
// Modo Legado: perfil memorial
// ============================================================

import { query } from '../db/pool.js';

// ------------------------------------------------------------
// Activar modo legado
// ------------------------------------------------------------
export async function activateLegacy(userId: string, message?: string | null) {
  await query(
    `UPDATE users
     SET legacy_mode = 1,
         legacy_message = $1,
         legacy_activated_at = datetime('now')
     WHERE id = $2 AND deleted_at IS NULL`,
    [message ?? null, userId]
  );
}

// ------------------------------------------------------------
// Desactivar modo legado
// ------------------------------------------------------------
export async function deactivateLegacy(userId: string) {
  await query(
    `UPDATE users
     SET legacy_mode = 0,
         legacy_message = NULL,
         legacy_activated_at = NULL
     WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
}

// ------------------------------------------------------------
// Verificar si un usuario está en modo legado
// ------------------------------------------------------------
export async function isUserInLegacyMode(userId: string): Promise<boolean> {
  const res = await query<{ legacy_mode: number }>(
    `SELECT legacy_mode FROM users WHERE id = $1`,
    [userId]
  );
  return Number(res.rows[0]?.legacy_mode ?? 0) === 1;
}

// ------------------------------------------------------------
// Info completa del modo legado del propio usuario
// ------------------------------------------------------------
export async function getMyLegacyInfo(userId: string) {
  const res = await query<{
    legacy_mode: number;
    legacy_message: string | null;
    legacy_activated_at: string | null;
  }>(
    `SELECT legacy_mode, legacy_message, legacy_activated_at
     FROM users WHERE id = $1`,
    [userId]
  );
  return res.rows[0] ?? null;
}

// ------------------------------------------------------------
// Datos de legado de un usuario por alias (para perfil público)
// ------------------------------------------------------------
export async function getLegacyByAlias(alias: string) {
  const res = await query<{
    legacy_mode: number;
    legacy_message: string | null;
    legacy_activated_at: string | null;
  }>(
    `SELECT legacy_mode, legacy_message, legacy_activated_at
     FROM users WHERE alias = $1 AND deleted_at IS NULL`,
    [alias]
  );
  const row = res.rows[0];
  if (!row) return null;
  return {
    legacy: row.legacy_mode === 1,
    legacy_message: row.legacy_message,
    legacy_activated_at: row.legacy_activated_at,
  };
}
