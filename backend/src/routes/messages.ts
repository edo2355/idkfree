import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';
import { sendMessage, getConversation, listConversations } from '../services/messageService.js';

const sendSchema = z.object({
  to: z.string().min(3).max(30),
  body: z.string().min(1).max(2000),
});

export async function messageRoutes(app: FastifyInstance) {
  // POST /api/messages — enviar mensaje
  app.post('/messages', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const userId = (req as any).userId;
      const result = await sendMessage({
        senderId: userId,
        receiverAlias: parsed.data.to,
        body: parsed.data.body,
      });
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return reply.code(404).send({ error: 'Usuario no encontrado' });
      if (err.message === 'CANNOT_MESSAGE_SELF') return reply.code(400).send({ error: 'No puedes enviarte mensajes' });
      if (err.message === 'INVALID_BODY') return reply.code(400).send({ error: 'Mensaje inválido' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/messages — lista de conversaciones
  app.get('/messages', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    try {
      const userId = (req as any).userId;
      const conversations = await listConversations(userId);
      return reply.send({ conversations });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/messages/:alias — conversación con un usuario
  app.get('/messages/:alias', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    try {
      const userId = (req as any).userId;
      const { alias } = req.params as { alias: string };
      const result = await getConversation(userId, alias);
      return reply.send(result);
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return reply.code(404).send({ error: 'Usuario no encontrado' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
