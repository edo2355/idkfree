// ============================================================
// repostService.ts — Republicar posts + dibujos
// ============================================================
import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

function uuid() { return randomUUID(); }

export async function repostPost(userId: string, originalPostId: string, body?: string) {
  // Verificar que el original existe y es visible
  const orig = await query<any>(
    `SELECT id, author_id, visibility FROM posts WHERE id = $1 AND deleted_at IS NULL`,
    [originalPostId]
  );
  if (!orig.rows[0]) throw new Error('POST_NOT_FOUND');

  const id = uuid();
  await query(
    `INSERT INTO posts (id, author_id, body, image_url, video_url, visibility, is_repost, original_post_id)
     VALUES ($1, $2, $3, NULL, NULL, $4, 1, $5)`,
    [id, userId, body ?? null, orig.rows[0].visibility, originalPostId]
  );

  return { id };
}

export async function getDrawings(postId: string) {
  const res = await query<any>(
    `SELECT d.id, d.post_id, d.author_id, d.drawing_url, d.created_at,
            u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
     FROM drawn_posts d
     JOIN users u ON u.id = d.author_id
     WHERE d.post_id = $1 AND d.deleted_at IS NULL
     ORDER BY d.created_at DESC`,
    [postId]
  );
  return { drawings: res.rows };
}

export async function createDrawing(userId: string, postId: string, drawingUrl: string) {
  // Verificar que el post existe
  const p = await query<any>(
    `SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL`,
    [postId]
  );
  if (!p.rows[0]) throw new Error('POST_NOT_FOUND');

  const id = uuid();
  await query(
    `INSERT INTO drawn_posts (id, post_id, author_id, drawing_url)
     VALUES ($1, $2, $3, $4)`,
    [id, postId, userId, drawingUrl]
  );
  return { id };
}

export async function deleteDrawing(userId: string, drawingId: string) {
  const res = await query(
    `UPDATE drawn_posts SET deleted_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
    [drawingId, userId]
  );
  return (res as any).changes > 0;
}
