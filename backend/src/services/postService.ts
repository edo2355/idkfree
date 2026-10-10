// ============================================================
// postService.ts
// ============================================================

import { query, pool, uuid } from '../db/pool.js';

function extractHashtags(body: string): string[] {
  const m = body.match(/#([a-z0-9_áéíóúñ]+)/gi) ?? [];
  return [...new Set(m.map((x) => x.slice(1).toLowerCase()))];
}

function extractMentions(body: string): string[] {
  const m = body.match(/@([a-z0-9_]+)/gi) ?? [];
  return [...new Set(m.map((x) => x.slice(1).toLowerCase()))];
}

export async function createPost(
  authorId: string,
  data: { body?: string; imageUrl?: string; visibility: string }
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const postId = uuid();
    await client.query(
      `INSERT INTO posts (id, author_id, body, image_url, visibility)
       VALUES ($1, $2, $3, $4, $5)`,
      [postId, authorId, data.body ?? null, data.imageUrl ?? null, data.visibility]
    );

    if (data.body) {
      for (const tag of extractHashtags(data.body)) {
        const existing = await client.query<{ id: string }>(
          `SELECT id FROM hashtags WHERE tag = $1`, [tag]
        );
        let tagId: string;
        if (existing.rows.length > 0) {
          tagId = existing.rows[0].id;
          await client.query(
            `UPDATE hashtags SET posts_count = posts_count + 1 WHERE id = $1`,
            [tagId]
          );
        } else {
          tagId = uuid();
          await client.query(
            `INSERT INTO hashtags (id, tag, posts_count) VALUES ($1, $2, 1)`,
            [tagId, tag]
          );
        }
        await client.query(
          `INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2)`,
          [postId, tagId]
        );
      }

      const mentions = extractMentions(data.body);
      for (const alias of mentions) {
        const userRes = await client.query<{ id: string }>(
          `SELECT id FROM users WHERE alias = $1 AND deleted_at IS NULL`,
          [alias]
        );
        if (userRes.rows.length === 0) continue;
        const mentionedId = userRes.rows[0].id;
        await client.query(
          `INSERT OR IGNORE INTO post_mentions (post_id, mentioned_user_id) VALUES ($1, $2)`,
          [postId, mentionedId]
        );
        await client.query(
          `INSERT INTO notifications (id, user_id, type, actor_id, target_id)
           VALUES ($1, $2, 'mention', $3, $4)`,
          [uuid(), mentionedId, authorId, postId]
        );
      }
    }

    await client.query('COMMIT');
    return { id: postId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getFeed(
  viewerId: string,
  options: { limit?: number; offset?: number; hashtag?: string }
) {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;

  let sql = `
    SELECT
      p.id, p.author_id, u.alias AS author_alias, u.name AS author_name,
      u.avatar_url AS author_avatar, p.body, p.image_url, p.visibility,
      p.created_at,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND deleted_at IS NULL) AS comments_count
    FROM posts p
    JOIN users u ON u.id = p.author_id
    LEFT JOIN follows f ON f.followed_id = p.author_id AND f.follower_id = $1
    WHERE p.deleted_at IS NULL
      AND (p.visibility = 'public' OR f.follower_id IS NOT NULL OR p.author_id = $2)
  `;
  const params: any[] = [viewerId, viewerId];

  if (options.hashtag) {
    params.push(options.hashtag.toLowerCase());
    sql += ` AND EXISTS (
      SELECT 1 FROM post_hashtags ph JOIN hashtags h ON h.id = ph.hashtag_id
      WHERE ph.post_id = p.id AND h.tag = $${params.length}
    )`;
  }

  params.push(limit, offset);
  sql += ` ORDER BY p.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const res = await query(sql, params);
  return res.rows;
}

export async function getUserPosts(userId: string) {
  const res = await query(
    `SELECT p.id, p.author_id, u.alias AS author_alias, u.name AS author_name,
      u.avatar_url AS author_avatar, p.body, p.image_url, p.visibility,
      p.created_at,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND deleted_at IS NULL) AS comments_count
     FROM posts p JOIN users u ON u.id = p.author_id
     WHERE p.author_id = $1 AND p.deleted_at IS NULL
     ORDER BY p.created_at DESC LIMIT 100`,
    [userId]
  );
  return res.rows;
}

export async function deletePost(postId: string, userId: string) {
  const res = await query(
    `UPDATE posts SET deleted_at = datetime('now')
     WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
    [postId, userId]
  );
  return res.rowCount > 0;
}

export async function likePost(postId: string, userId: string) {
  await query(
    `INSERT OR IGNORE INTO post_likes (user_id, post_id) VALUES ($1, $2)`,
    [userId, postId]
  );
}

export async function unlikePost(postId: string, userId: string) {
  await query(
    `DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
}
