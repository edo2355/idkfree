// ============================================================
// searchService.ts
// Búsqueda de usuarios y posts
// ============================================================

import { query } from '../db/pool.js';

// ------------------------------------------------------------
// Buscar usuarios por alias o name
// ------------------------------------------------------------
export async function searchUsers(term: string, limit = 20, offset = 0) {
  const clean = term.trim().toLowerCase();
  if (clean.length < 2) return [];

  const like = `%${clean}%`;
  const likePrefix = `${clean}%`;

  const res = await query(
    `SELECT
       u.id, u.alias, u.name, u.bio, u.avatar_url, u.accent_color, u.created_at,
       (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) AS followers_count
     FROM users u
     WHERE u.deleted_at IS NULL
       AND (LOWER(u.alias) LIKE $1 OR LOWER(COALESCE(u.name, '')) LIKE $2)
     ORDER BY
       CASE WHEN LOWER(u.alias) = $3 THEN 0
            WHEN LOWER(u.alias) LIKE $4 THEN 1
            ELSE 2 END,
       followers_count DESC,
       u.created_at DESC
     LIMIT $5 OFFSET $6`,
    [like, like, clean, likePrefix, limit, offset]
  );
  return res.rows;
}

// ------------------------------------------------------------
// Buscar posts por body (solo visibles al viewer)
// ------------------------------------------------------------
export async function searchPosts(
  term: string,
  viewerId: string | null,
  limit = 20,
  offset = 0
) {
  const clean = term.trim().toLowerCase();
  if (clean.length < 2) return [];

  const like = `%${clean}%`;

  const res = await query(
    `SELECT
       p.id, p.author_id, u.alias AS author_alias, u.name AS author_name,
       u.avatar_url AS author_avatar, p.body, p.image_url, p.visibility,
       p.created_at,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND deleted_at IS NULL) AS comments_count
     FROM posts p
     JOIN users u ON u.id = p.author_id
     LEFT JOIN follows f ON f.followed_id = p.author_id AND f.follower_id = $1
     WHERE p.deleted_at IS NULL
       AND LOWER(COALESCE(p.body, '')) LIKE $2
       AND (p.visibility = 'public' OR f.follower_id IS NOT NULL OR p.author_id = $3)
     ORDER BY p.created_at DESC
     LIMIT $4 OFFSET $5`,
    [viewerId, like, viewerId, limit, offset]
  );
  return res.rows;
}
