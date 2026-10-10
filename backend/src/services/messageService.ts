// Servicio de mensajes directos
import { query, uuid } from '../db/pool.js';
import { maybeTriggerBotReply } from './botService.js';

interface SendInput {
  senderId: string;
  receiverAlias: string;
  body: string;
}

export async function sendMessage(input: SendInput) {
  const body = input.body.trim();
  if (!body || body.length > 2000) throw new Error('INVALID_BODY');

  const receiverRes = await query<{ id: string }>(
    'SELECT id FROM users WHERE alias = $1',
    [input.receiverAlias.toLowerCase().trim()]
  );
  if (receiverRes.rows.length === 0) throw new Error('USER_NOT_FOUND');

  const receiverId = receiverRes.rows[0].id;
  if (receiverId === input.senderId) throw new Error('CANNOT_MESSAGE_SELF');

  const id = uuid();
  await query(
    `INSERT INTO direct_messages (id, sender_id, receiver_id, body)
     VALUES ($1, $2, $3, $4)`,
    [id, input.senderId, receiverId, body]
  );

  // Si el receptor es un bot, dispara respuesta automática
  maybeTriggerBotReply(receiverId, input.senderId).catch(() => {});

  return { id };
}

export async function getConversation(userId: string, otherAlias: string, limit: number = 50) {
  const otherRes = await query<{ id: string; alias: string; name: string | null; avatar_url: string | null }>(
    'SELECT id, alias, name, avatar_url FROM users WHERE alias = $1',
    [otherAlias.toLowerCase().trim()]
  );
  if (otherRes.rows.length === 0) throw new Error('USER_NOT_FOUND');
  const other = otherRes.rows[0];

  const messagesRes = await query(
    `SELECT id, sender_id, receiver_id, body, read_at, created_at
     FROM direct_messages
     WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC
     LIMIT $3`,
    [userId, other.id, limit]
  );

  await query(
    `UPDATE direct_messages SET read_at = datetime('now')
     WHERE receiver_id = $1 AND sender_id = $2 AND read_at IS NULL`,
    [userId, other.id]
  );

  return { other, messages: messagesRes.rows };
}

export async function listConversations(userId: string) {
  // 1. Obtener los "otros usuarios" con los que hay conversación + último mensaje
  const othersRes = await query<{ other_id: string; last_at: string }>(
    `SELECT
       CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_id,
       MAX(created_at) AS last_at
     FROM direct_messages
     WHERE sender_id = $1 OR receiver_id = $1
     GROUP BY other_id
     ORDER BY last_at DESC`,
    [userId]
  );

  const conversations = [];

  for (const row of othersRes.rows) {
    // Datos del otro usuario
    const userRes = await query<{ id: string; alias: string; name: string | null; avatar_url: string | null }>(
      'SELECT id, alias, name, avatar_url FROM users WHERE id = $1',
      [row.other_id]
    );
    if (userRes.rows.length === 0) continue;
    const u = userRes.rows[0];

    // Último mensaje
    const lastRes = await query<{ body: string }>(
      `SELECT body FROM direct_messages
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, row.other_id]
    );

    // No leídos
    const unreadRes = await query<{ count: number }>(
      `SELECT COUNT(*) AS count FROM direct_messages
       WHERE receiver_id = $1 AND sender_id = $2 AND read_at IS NULL`,
      [userId, row.other_id]
    );

    conversations.push({
      other_id: u.id,
      other_alias: u.alias,
      other_name: u.name,
      other_avatar: u.avatar_url,
      last_message: lastRes.rows[0]?.body ?? '',
      last_at: row.last_at,
      unread_count: unreadRes.rows[0]?.count ?? 0,
    });
  }

  return conversations;
}
