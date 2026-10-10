import { query, pool, uuid } from '../db/pool.js';

export async function createComment(
  postId: string,
  authorId: string,
  data: {
    body?: string;
    mediaType?: 'audio' | 'photo' | 'gif' | 'video' | 'text';
    mediaUrl?: string;
    mediaDuration?: number;
    parentId?: string;
  }
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const postRes = await client.query(
      `SELECT id, author_id FROM posts WHERE id = $1 AND deleted_at IS NULL`,
      [postId]
    );
    if (postRes.rows.length === 0) throw new Error('POST_NOT_FOUND');
    const postAuthorId = postRes.rows[0].author_id;

    const commentId = uuid();
    await client.query(
      `INSERT INTO comments
        (id, post_id, author_id, body, media_type, media_url, media_duration, parent_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        commentId, postId, authorId,
        data.body ?? null, data.mediaType ?? null,
        data.mediaUrl ?? null, data.mediaDuration ?? null,
        data.parentId ?? null,
      ]
    );

    if (data.parentId) {
      await client.query(
        `UPDATE comments SET replies_count = replies_count + 1 WHERE id = $1`,
        [data.parentId]
      );
    }

    if (postAuthorId !== authorId) {
      await client.query(
        `INSERT INTO notifications (id, user_id, type, actor_id, target_id)
         VALUES ($1, $2, 'comment', $3, $4)`,
        [uuid(), postAuthorId, authorId, commentId]
      );
    }

    if (data.parentId) {
      const parentRes = await client.query(
        `SELECT author_id FROM comments WHERE id = $1`,
        [data.parentId]
      );
      const parentAuthorId = parentRes.rows[0]?.author_id;
      if (parentAuthorId && parentAuthorId !== authorId) {
        await client.query(
          `INSERT INTO notifications (id, user_id, type, actor_id, target_id)
           VALUES ($1, $2, 'reply', $3, $4)`,
          [uuid(), parentAuthorId, authorId, commentId]
        );
      }
    }

    await client.query('COMMIT');
    return { id: commentId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getComments(postId: string, limit = 50, offset = 0) {
  const res = await query(
    `SELECT
      c.id, c.post_id, c.author_id, c.body,
      c.media_type, c.media_url, c.media_duration,
      c.parent_id, c.likes_count, c.replies_count, c.created_at,
      u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
     FROM comments c
     JOIN users u ON u.id = c.author_id
     WHERE c.post_id = $1 AND c.deleted_at IS NULL AND c.parent_id IS NULL
     ORDER BY c.created_at DESC
     LIMIT $2 OFFSET $3`,
    [postId, limit, offset]
  );
  return res.rows;
}

export async function getReplies(commentId: string) {
  const res = await query(
    `SELECT
      c.id, c.post_id, c.author_id, c.body,
      c.media_type, c.media_url, c.media_duration,
      c.parent_id, c.likes_count, c.replies_count, c.created_at,
      u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
     FROM comments c
     JOIN users u ON u.id = c.author_id
     WHERE c.parent_id = $1 AND c.deleted_at IS NULL
     ORDER BY c.created_at ASC`,
    [commentId]
  );
  return res.rows;
}

export async function deleteComment(commentId: string, userId: string) {
  const res = await query(
    `UPDATE comments SET deleted_at = datetime('now')
     WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
    [commentId, userId]
  );
  return res.rowCount > 0;
}

export async function likeComment(commentId: string, userId: string) {
  const res = await query(
    `INSERT OR IGNORE INTO comment_likes (user_id, comment_id) VALUES ($1, $2)`,
    [userId, commentId]
  );
  if (res.rowCount > 0) {
    await query(
      `UPDATE comments SET likes_count = likes_count + 1 WHERE id = $1`,
      [commentId]
    );
  }
}

export async function unlikeComment(commentId: string, userId: string) {
  const res = await query(
    `DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2`,
    [userId, commentId]
  );
  if (res.rowCount > 0) {
    await query(
      `UPDATE comments SET likes_count = likes_count - 1 WHERE id = $1`,
      [commentId]
    );
  }
}
