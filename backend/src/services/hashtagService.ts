// ============================================================
// hashtagService.ts
// Trending hashtags + posts por hashtag
// ============================================================

import { query } from '../db/pool.js';

// ------------------------------------------------------------
// Hashtags trending (top por posts_count)
// ------------------------------------------------------------
export async function getTrendingHashtags(limit = 20, offset = 0) {
  const res = await query(
    `SELECT id, tag, posts_count, created_at
     FROM hashtags
     WHERE posts_count > 0
     ORDER BY posts_count DESC, tag ASC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return res.rows;
}

// ------------------------------------------------------------
// Info de un hashtag por tag
// ------------------------------------------------------------
export async function getHashtagByTag(tag: string) {
  const res = await query(
    `SELECT id, tag, posts_count, created_at FROM hashtags WHERE tag = $1`,
    [tag.toLowerCase()]
  );
  return res.rows[0] ?? null;
}

// ------------------------------------------------------------
// Posts que usan un hashtag (respetando visibilidad)
// ------------------------------------------------------------
export async function getHashtagPosts(
  tag: string,
  viewerId: string | null,
  limit = 20,
  offset = 0
) {
  const res = await query(
    `SELECT
       p.id, p.author_id, u.alias AS author_alias, u.name AS author_name,
       u.avatar_url AS author_avatar, p.body, p.image_url, p.visibility,
       p.created_at,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND deleted_at IS NULL) AS comments_count
     FROM posts p
     JOIN users u ON u.id = p.author_id
     JOIN post_hashtags ph ON ph.post_id = p.id
     JOIN hashtags h ON h.id = ph.hashtag_id
     LEFT JOIN follows f ON f.followed_id = p.author_id AND f.follower_id = $1
     WHERE h.tag = $2
       AND p.deleted_at IS NULL
       AND (p.visibility = 'public' OR f.follower_id IS NOT NULL OR p.author_id = $3)
     ORDER BY p.created_at DESC
     LIMIT $4 OFFSET $5`,
    [viewerId, tag.toLowerCase(), viewerId, limit, offset]
  );
  return res.rows;
}
