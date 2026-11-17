import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { sendTelegramMessage } from '../services/telegramService.js';

export async function telegramRoutes(app: FastifyInstance) {
  
  // Obtener el estado de vinculación del usuario
  app.get('/telegram/status', { preHandler: [requireAuth] }, async (req, reply) => {
    const userId = (req as any).userId;
    try {
      const res = await query('SELECT telegram_chat_id FROM users WHERE id = $1', [userId]);
      const chatId = res.rows[0]?.telegram_chat_id;
      return reply.send({ linked: !!chatId, chatId: chatId || null });
    } catch (error) {
      return reply.code(500).send({ error: 'Error obteniendo estado' });
    }
  });

  // Desvincular Telegram
  app.post('/telegram/unlink', { preHandler: [requireAuth] }, async (req, reply) => {
    const userId = (req as any).userId;
    try {
      await query('UPDATE users SET telegram_chat_id = NULL WHERE id = $1', [userId]);
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(500).send({ error: 'Error desvinculando' });
    }
  });

  // Webhook del Bot (Recibe /start y mensajes)
  app.post('/telegram/webhook', async (req, reply) => {
    const { message } = req.body as any;
    
    if (message && message.text) {
      const chatId = message.chat.id.toString();
      const text = message.text;

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const userIdParam = parts.length > 1 ? parts[1] : null;

        if (userIdParam) {
          // Vincular usuario
          await query('UPDATE users SET telegram_chat_id = $1 WHERE id = $2', [chatId, userIdParam]);
          await sendTelegramMessage(
            chatId, 
            '✅ <b>¡Cuenta vinculada con éxito!</b>\n\nA partir de ahora recibirás tus notificaciones de IDKMEDIA por aquí.\n\nPuedes volver a la web y recargar la página.'
          );
        } else {
          await sendTelegramMessage(chatId, '👋 ¡Hola! Bienvenido al bot oficial de <b>IDKMEDIA</b>.\n\nPara vincular tu cuenta, hazlo desde la página web en tu perfil.');
        }
      }
    }
    
    return reply.send({ ok: true });
  });
}
