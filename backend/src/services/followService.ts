// ============================================================
// followService.ts
// ============================================================

import { query, uuid } from '../db/pool.js';

export async function follow(followerId: string, followedId: string) {
  if (followerId === followedId) throw new Error('NO_SELF_FOLLOW');

  const res = await query(
    `INSERT OR IGNORE INTO follows (follower_id, followed_id) VALUES ($1, $2)`,
    [followerId, followedId]
  );

  // Solo notificar si se insertó de verdad
  if (res.rowCount > 0) {
    await query(
      `INSERT INTO notifications (id, user_id, type, actor_id)
       VALUES ($1, $2, 'follow', $3)`,
      [uuid(), followedId, followerId]
    );
  }
}

export async function unfollow(followerId: string, followedId: string) {
  await query(
    `DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2`,
    [followerId, followedId]
  );
}

export async function getFollowers(userId: string) {
  const res = await query(
    `SELECT u.id, u.alias, u.name, u.avatar_url FROM follows f
     JOIN users u ON u.id = f.follower_id
     WHERE f.followed_id = $1 AND u.deleted_at IS NULL
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return res.rows;
}

export async function getFollowing(userId: string) {
  const res = await query(
    `SELECT u.id, u.alias, u.name, u.avatar_url FROM follows f
     JOIN users u ON u.id = f.followed_id
     WHERE f.follower_id = $1 AND u.deleted_at IS NULL
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return res.rows;
}
