// ============================================================
// vibeService.ts
// Vibes efímeras (24h) + resonancias mutuas
// ============================================================

import { query, uuid } from '../db/pool.js';

const MOODS = ['silencio','charlar','crear','tranquilo','nose'] as const;
export type Mood = typeof MOODS[number];
export const VALID_MOODS = MOODS;

// ------------------------------------------------------------
// Crear vibe (expira en 24h)
// ------------------------------------------------------------
export async function createVibe(
  userId: string,
  data: { mood: Mood; message?: string | null }
) {
  const id = uuid();
  await query(
    `INSERT INTO vibes (id, user_id, mood, message, expires_at)
     VALUES ($1, $2, $3, $4, datetime('now', '+48 hours'))`,
    [id, userId, data.mood, data.message ?? null]
  );
  return { id };
}

// ------------------------------------------------------------
// Feed de vibes activas
// ------------------------------------------------------------
export async function getActiveVibes(
  viewerId: string | null,
  limit = 50,
  offset = 0
) {
  const res = await query(
    `SELECT
       v.id, v.user_id, v.mood, v.message, v.expires_at, v.created_at,
       u.alias AS author_alias, u.name AS author_name,
       u.avatar_url AS author_avatar, u.accent_color AS author_accent,
       (SELECT COUNT(*) FROM vibe_resonances WHERE vibe_id = v.id) AS resonances_count,
       CASE WHEN $1 IS NULL THEN 0
            WHEN EXISTS (SELECT 1 FROM vibe_resonances WHERE vibe_id = v.id AND user_id = $2)
            THEN 1 ELSE 0 END AS viewer_resonated
     FROM vibes v
     JOIN users u ON u.id = v.user_id
     WHERE v.expires_at > datetime('now')
       AND u.deleted_at IS NULL
     ORDER BY v.created_at DESC
     LIMIT $3 OFFSET $4`,
    [viewerId, viewerId, limit, offset]
  );
  return res.rows;
}

// ------------------------------------------------------------
// Vibe por ID
// ------------------------------------------------------------
export async function getVibeById(vibeId: string) {
  const res = await query(
    `SELECT id, user_id, mood, message, expires_at, created_at
     FROM vibes WHERE id = $1`,
    [vibeId]
  );
  return res.rows[0] ?? null;
}

// ------------------------------------------------------------
// Borrar vibe propia
// ------------------------------------------------------------
export async function deleteVibe(vibeId: string, userId: string) {
  const res = await query(
    `DELETE FROM vibes WHERE id = $1 AND user_id = $2`,
    [vibeId, userId]
  );
  return res.rowCount > 0;
}

// ------------------------------------------------------------
// Resonar / quitar resonancia
// ------------------------------------------------------------
export async function resonateVibe(vibeId: string, userId: string) {
  await query(
    `INSERT OR IGNORE INTO vibe_resonances (vibe_id, user_id) VALUES ($1, $2)`,
    [vibeId, userId]
  );
}

export async function unresonateVibe(vibeId: string, userId: string) {
  await query(
    `DELETE FROM vibe_resonances WHERE vibe_id = $1 AND user_id = $2`,
    [vibeId, userId]
  );
}

// ------------------------------------------------------------
// Vibes activas de un usuario por alias
// ------------------------------------------------------------
export async function getUserActiveVibes(alias: string, viewerId: string | null) {
  const res = await query(
    `SELECT
       v.id, v.user_id, v.mood, v.message, v.expires_at, v.created_at,
       u.alias AS author_alias, u.name AS author_name,
       u.avatar_url AS author_avatar, u.accent_color AS author_accent,
       (SELECT COUNT(*) FROM vibe_resonances WHERE vibe_id = v.id) AS resonances_count,
       CASE WHEN $1 IS NULL THEN 0
            WHEN EXISTS (SELECT 1 FROM vibe_resonances WHERE vibe_id = v.id AND user_id = $2)
            THEN 1 ELSE 0 END AS viewer_resonated
     FROM vibes v
     JOIN users u ON u.id = v.user_id
     WHERE u.alias = $3
       AND v.expires_at > datetime('now')
       AND u.deleted_at IS NULL
     ORDER BY v.created_at DESC
     LIMIT 50`,
    [viewerId, viewerId, alias]
  );
  return res.rows;
}

// ------------------------------------------------------------
// Matches: resonancia mutua entre viewer y otros usuarios
// Match = existe vibe activa mía resonada por X
//      Y existe vibe activa de X resonada por mí
// ------------------------------------------------------------
export async function getMatches(viewerId: string) {
  const res = await query(
    `SELECT DISTINCT
       other.id AS user_id, other.alias, other.name,
       other.avatar_url, other.accent_color
     FROM users other
     WHERE other.deleted_at IS NULL
       AND other.id <> $1
       AND EXISTS (
         SELECT 1 FROM vibes v1
         JOIN vibe_resonances r1 ON r1.vibe_id = v1.id
         WHERE v1.user_id = $2
           AND v1.expires_at > datetime('now')
           AND r1.user_id = other.id
       )
       AND EXISTS (
         SELECT 1 FROM vibes v2
         JOIN vibe_resonances r2 ON r2.vibe_id = v2.id
         WHERE v2.user_id = other.id
           AND v2.expires_at > datetime('now')
           AND r2.user_id = $3
       )
     ORDER BY other.alias ASC`,
    [viewerId, viewerId, viewerId]
  );
  return res.rows;
}
