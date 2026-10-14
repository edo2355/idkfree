// ============================================================
// streamService.ts — Streams en vivo (preparación)
// ============================================================
import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

function uuid() { return randomUUID(); }

export async function startStream(hostId: string, title: string, description?: string) {
  // Cerrar cualquier stream previo del host
  await query(
    `UPDATE streams SET status = 'ended', ended_at = CURRENT_TIMESTAMP
     WHERE host_id = $1 AND status IN ('pending','live')`,
    [hostId]
  );

  const id = uuid();
  const roomId = `idk-${id.slice(0, 8)}`;

  await query(
    `INSERT INTO streams (id, host_id, title, description, room_id, status, started_at)
     VALUES ($1, $2, $3, $4, $5, 'live', CURRENT_TIMESTAMP)`,
    [id, hostId, title, description ?? null, roomId]
  );

  return { id, roomId };
}

export async function endStream(hostId: string, streamId: string) {
  const res = await query(
    `UPDATE streams SET status = 'ended', ended_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND host_id = $2 AND status = 'live'`,
    [streamId, hostId]
  );
  return (res as any).changes > 0;
}

export async function getActiveStreams(viewerId: string, limit = 20) {
  const res = await query<any>(
    `SELECT s.id, s.host_id, s.title, s.description, s.room_id, s.status,
            s.viewers_count, s.max_viewers, s.started_at, s.created_at,
            u.alias AS host_alias, u.name AS host_name, u.avatar_url AS host_avatar
     FROM streams s
     JOIN users u ON u.id = s.host_id
     WHERE s.status = 'live' AND s.deleted_at IS NULL
     ORDER BY s.viewers_count DESC, s.started_at DESC
     LIMIT $1`,
    [limit]
  );
  return { streams: res.rows };
}

export async function getStream(id: string, viewerId: string) {
  const res = await query<any>(
    `SELECT s.id, s.host_id, s.title, s.description, s.room_id, s.status,
            s.viewers_count, s.max_viewers, s.started_at, s.ended_at, s.created_at,
            u.alias AS host_alias, u.name AS host_name, u.avatar_url AS host_avatar
     FROM streams s
     JOIN users u ON u.id = s.host_id
     WHERE s.id = $1 AND s.deleted_at IS NULL`,
    [id]
  );
  return res.rows[0] ?? null;
}
