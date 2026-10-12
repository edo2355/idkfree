// ============================================================
// storiesService.ts — Historias 24h
// ============================================================
import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

function uuid() { return randomUUID(); }

export async function createStory(
  authorId: string,
  data: { mediaUrl: string; mediaType: 'image' | 'video' }
) {
  const id = uuid();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await query(
    `INSERT INTO stories (id, author_id, media_url, media_type, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, authorId, data.mediaUrl, data.mediaType, expiresAt]
  );

  return { id, expires_at: expiresAt };
}

export async function getStoriesFeed(viewerId: string) {
  // Trae historias no expiradas de:
  //  1. El propio viewer
  //  2. Usuarios que sigue
  // Agrupadas por autor.
  const res = await query<any>(
    `SELECT s.id, s.author_id, s.media_url, s.media_type, s.created_at, s.expires_at,
            u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar,
            (SELECT COUNT(*) FROM story_views sv WHERE sv.story_id = s.id) AS viewers_count,
            EXISTS(SELECT 1 FROM story_views sv WHERE sv.story_id = s.id AND sv.viewer_id = $1) AS viewed_by_me
     FROM stories s
     JOIN users u ON u.id = s.author_id
     WHERE s.deleted_at IS NULL
       AND s.expires_at > datetime('now')
       AND (s.author_id = $1
            OR s.author_id IN (SELECT followed_id FROM follows WHERE follower_id = $1))
     ORDER BY s.created_at DESC`,
    [viewerId]
  );

  // Agrupar por autor
  const groups: Record<string, any> = {};
  for (const row of res.rows) {
    if (!groups[row.author_id]) {
      groups[row.author_id] = {
        author_id: row.author_id,
        author_alias: row.author_alias,
        author_name: row.author_name,
        author_avatar: row.author_avatar,
        stories: [],
        all_viewed: true,
      };
    }
    groups[row.author_id].stories.push({
      id: row.id,
      author_id: row.author_id,
      author_alias: row.author_alias,
      author_name: row.author_name,
      author_avatar: row.author_avatar,
      media_url: row.media_url,
      media_type: row.media_type,
      created_at: row.created_at,
      expires_at: row.expires_at,
      viewers_count: Number(row.viewers_count),
      viewed_by_me: !!row.viewed_by_me,
    });
    if (!row.viewed_by_me) groups[row.author_id].all_viewed = false;
  }

  // Propio viewer primero, luego resto
  const list = Object.values(groups).sort((a: any, b: any) => {
    if (a.author_id === viewerId) return -1;
    if (b.author_id === viewerId) return 1;
    return 0;
  });

  return { stories: list };
}

export async function getStoryById(id: string, viewerId: string) {
  const res = await query<any>(
    `SELECT s.*, u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
     FROM stories s
     JOIN users u ON u.id = s.author_id
     WHERE s.id = $1 AND s.deleted_at IS NULL AND s.expires_at > datetime('now')`,
    [id]
  );
  const story = res.rows[0];
  if (!story) return null;

  // Marcar como vista
  await query(
    `INSERT OR IGNORE INTO story_views (story_id, viewer_id) VALUES ($1, $2)`,
    [id, viewerId]
  );

  return {
    id: story.id,
    author_id: story.author_id,
    author_alias: story.author_alias,
    author_name: story.author_name,
    author_avatar: story.author_avatar,
    media_url: story.media_url,
    media_type: story.media_type,
    created_at: story.created_at,
    expires_at: story.expires_at,
  };
}

export async function deleteStory(id: string, userId: string) {
  const res = await query(
    `UPDATE stories SET deleted_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
    [id, userId]
  );
  return (res as any).changes > 0 || res.rows?.length > 0;
}
