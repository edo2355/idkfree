import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function getPosts() {
  const res = await query('SELECT id, user_id as userId, content, created_at as createdAt FROM posts ORDER BY created_at DESC LIMIT 50');
  return res.rows;
}

export async function createPost(userId: string, content: string) {
  const id = randomUUID();
  await query('INSERT INTO posts (id, user_id, content) VALUES ($1, $2, $3)', [id, userId, content]);
  return { id, userId, content };
}

export async function getProfile(userId: string) {
  const res = await query('SELECT id, alias, email, name, bio, created_at as createdAt FROM users WHERE id = $1', [userId]);
  if (res.rows.length === 0) throw new Error('Usuario no encontrado');
  return res.rows[0];
}
