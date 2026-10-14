// ============================================================
// profileService.ts
// Perfil de usuario: público, edición y cambio de contraseña
// ============================================================

import { query } from '../db/pool.js';
import { hashPassword, verifyPassword } from '../crypto/password.js';

const ACCENT_COLORS = [
  'blanco','negro','rojo','azul','verde',
  'dorado','violeta','coral','menta','mostaza',
] as const;

export type AccentColor = typeof ACCENT_COLORS[number];
export const VALID_ACCENTS = ACCENT_COLORS;

// ------------------------------------------------------------
// GET perfil público por alias
// ------------------------------------------------------------
export async function getProfileByAlias(alias: string, viewerId?: string) {
  const userRes = await query<{
    id: string; alias: string; name: string | null;
    bio: string | null; avatar_url: string | null;
    accent_color: string; created_at: string;
  }>(
    `SELECT id, alias, name, bio, avatar_url, accent_color, created_at
     FROM users
     WHERE alias = $1 AND deleted_at IS NULL`,
    [alias]
  );
  const user = userRes.rows[0];
  if (!user) return null;

  const [postsCount, followersCount, followingCount, isFollowing] = await Promise.all([
    query<{ count: number }>(
      `SELECT COUNT(*) AS count FROM posts WHERE author_id = $1 AND deleted_at IS NULL`,
      [user.id]
    ),
    query<{ count: number }>(
      `SELECT COUNT(*) AS count FROM follows WHERE followed_id = $1`,
      [user.id]
    ),
    query<{ count: number }>(
      `SELECT COUNT(*) AS count FROM follows WHERE follower_id = $1`,
      [user.id]
    ),
    viewerId
      ? query<{ one: number }>(
          `SELECT 1 AS one FROM follows WHERE follower_id = $1 AND followed_id = $2`,
          [viewerId, user.id]
        )
      : Promise.resolve({ rows: [] }),
  ]);

  return {
    user,
    stats: {
      posts: Number(postsCount.rows[0]?.count ?? 0),
      followers: Number(followersCount.rows[0]?.count ?? 0),
      following: Number(followingCount.rows[0]?.count ?? 0),
    },
    is_following: isFollowing.rows.length > 0,
    is_me: viewerId === user.id,
  };
}

// ------------------------------------------------------------
// PATCH editar perfil propio
// ------------------------------------------------------------
export async function updateProfile(
  userId: string,
  data: {
    name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    accent_color?: AccentColor;
  }
) {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.bio !== undefined) { fields.push(`bio = $${i++}`); values.push(data.bio); }
  if (data.avatar_url !== undefined) { fields.push(`avatar_url = $${i++}`); values.push(data.avatar_url); }
  if (data.accent_color !== undefined) { fields.push(`accent_color = $${i++}`); values.push(data.accent_color); }

  if (fields.length === 0) return null;

  values.push(userId);
  const res = await query<{
    id: string; alias: string; name: string | null;
    bio: string | null; avatar_url: string | null;
    accent_color: string;
  }>(
    `UPDATE users SET ${fields.join(', ')}
     WHERE id = $${i} AND deleted_at IS NULL
     RETURNING id, alias, name, bio, avatar_url, accent_color`,
    values
  );
  return res.rows[0] ?? null;
}

// ------------------------------------------------------------
// Cambiar contraseña
// ------------------------------------------------------------
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<'OK' | 'INVALID_CURRENT' | 'NOT_FOUND'> {
  const res = await query<{ password_hash: string }>(
    `SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
  const row = res.rows[0];
  if (!row) return 'NOT_FOUND';

  const ok = await verifyPassword(row.password_hash, currentPassword);
  if (!ok) return 'INVALID_CURRENT';

  const newHash = await hashPassword(newPassword);
  await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [newHash, userId]);
  return 'OK';
}


// ------------------------------------------------------------
// Sugerencias: usuarios que NO sigues y NO eres tú
// Ordenados: primero los que tienen más posts, luego aleatorio
// ------------------------------------------------------------
export async function getSuggestedUsers(userId: string, limit = 10) {
  const res = await query<{
    id: string;
    alias: string;
    name: string | null;
    avatar_url: string | null;
    bio: string | null;
    posts_count: number;
    followers_count: number;
  }>(
    `SELECT u.id, u.alias, u.name, u.avatar_url, u.bio,
            (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND deleted_at IS NULL) AS posts_count,
            (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) AS followers_count
     FROM users u
     WHERE u.id != $1
       AND u.deleted_at IS NULL
       AND u.id NOT IN (SELECT followed_id FROM follows WHERE follower_id = $1)
     ORDER BY posts_count DESC, followers_count DESC, RANDOM()
     LIMIT $2`,
    [userId, limit]
  );
  return { users: res.rows };
}
