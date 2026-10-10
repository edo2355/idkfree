// ============================================================
// notifications.ts - Rutas HTTP
// ============================================================

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  getNotifications, getUnreadCount,
  markNotificationRead, markAllRead,
  registerPushToken,
} from '../services/notificationService.js';
import { requireAuth } from '../middleware/auth.js';

const pushTokenSchema = z.object({
  token: z.string().min(10).max(500),
  platform: z.enum(['ios', 'android', 'web']),
});

export async function notificationRoutes(app: FastifyInstance) {
  // GET /api/notifications
  app.get('/notifications', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const notifications = await getNotifications(
        req.userId!,
        limit ? parseInt(limit) : 50
      );
      const unread = await getUnreadCount(req.userId!);
      return reply.send({ notifications, unread });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/notifications/unread-count
  app.get('/notifications/unread-count', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      const unread = await getUnreadCount(req.userId!);
      return reply.send({ unread });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // PATCH /api/notifications/:id/read
  app.patch('/notifications/:id/read', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      await markNotificationRead(req.userId!, id);
      return reply.send({ ok: true });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/notifications/read-all
  app.post('/notifications/read-all', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      const count = await markAllRead(req.userId!);
      return reply.send({ ok: true, marked: count });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/me/push-token
  app.post('/me/push-token', { preHandler: [requireAuth] }, async (req, reply) => {
    const parsed = pushTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      await registerPushToken(req.userId!, parsed.data.token, parsed.data.platform);
      return reply.send({ ok: true });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
