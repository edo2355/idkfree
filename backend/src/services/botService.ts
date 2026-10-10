// Bot de respuestas automáticas para usuarios bot (ej: ana)
import { query, uuid } from '../db/pool.js';

const BOT_ALIASES = ['ana'];

const ANA_RESPONSES = [
  'jajaja sí',
  '¿en serio?',
  'cuéntame más',
  'uy, no sé qué decir',
  'eso mismo pienso yo',
  '¿y tú qué tal?',
  'me encanta eso',
  'qué locura',
  'sí, totalmente',
  'no lo había pensado así',
  'interesante...',
  'jajaja me muero',
  '¿dónde estás?',
  '¿nos vemos luego?',
  'buena idea',
  'okey',
  '👍',
  'te escribo luego',
  'me tengo que ir, después seguimos',
  '¿viste lo último que subí?',
];

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Dispara una respuesta del bot tras un delay aleatorio (2-5 seg).
 * No bloquea el envío del mensaje original.
 */
export async function maybeTriggerBotReply(receiverId: string, senderId: string): Promise<void> {
  const receiverRes = await query<{ alias: string }>(
    'SELECT alias FROM users WHERE id = $1',
    [receiverId]
  );
  if (receiverRes.rows.length === 0) return;

  const alias = receiverRes.rows[0].alias;
  if (!BOT_ALIASES.includes(alias)) return;

  // Delay aleatorio 2-5 seg
  const delay = 2000 + Math.floor(Math.random() * 3000);

  setTimeout(async () => {
    try {
      const reply = pickRandom(ANA_RESPONSES);
      await query(
        `INSERT INTO direct_messages (id, sender_id, receiver_id, body)
         VALUES ($1, $2, $3, $4)`,
        [uuid(), receiverId, senderId, reply]
      );
      console.log(`[bot] ${alias} respondió: "${reply}"`);
    } catch (e) {
      console.error('[bot] error respondiendo:', e);
    }
  }, delay);
}
