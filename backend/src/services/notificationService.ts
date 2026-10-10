// ============================================================
// notificationService.ts
// Notificaciones del usuario
// ============================================================

import { query, uuid } from '../db/pool.js';

export async function getNotifications(userId: string, limit = 50) {
  const res = await query(
    `SELECT
      n.id, n.type, n.target_id, n.body, n.read_at, n.created_at,
      u.alias AS actor_alias, u.name AS actor_name, u.avatar_url AS actor_avatar
     FROM notifications n
     LEFT JOIN users u ON u.id = n.actor_id
     WHERE n.user_id = $1
     ORDER BY n.created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return res.rows;
}

export async function getUnreadCount(userId: string): Promise<number> {
  const res = await query<{ count: number }>(
    `SELECT COUNT(*) AS count FROM notifications
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );
  return Number(res.rows[0]?.count ?? 0);
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const res = await query(
    `UPDATE notifications SET read_at = datetime('now')
     WHERE id = $1 AND user_id = $2 AND read_at IS NULL`,
    [notificationId, userId]
  );
  return res.rowCount > 0;
}

export async function markAllRead(userId: string) {
  const res = await query(
    `UPDATE notifications SET read_at = datetime('now')
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );
  return res.rowCount;
}

export async function registerPushToken(
  userId: string,
  token: string,
  platform: 'ios' | 'android' | 'web'
) {
  await query(
    `INSERT INTO push_tokens (id, user_id, token, platform)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (token) DO UPDATE
       SET user_id = excluded.user_id, last_used_at = datetime('now')`,
    [uuid(), userId, token, platform]
  );
}
