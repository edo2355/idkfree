// ============================================================
// streams.ts — Rutas HTTP de streams en vivo
// ============================================================
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { startStream, endStream, getActiveStreams, getStream } from '../services/streamService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const startSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).nullable().optional(),
});

export async function streamRoutes(app: FastifyInstance) {
  // POST /api/streams/start
  app.post('/streams/start', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const parsed = startSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await startStream(req.userId!, parsed.data.title, parsed.data.description ?? undefined);
      return reply.code(201).send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/streams/:id/end
  app.post('/streams/:id/end', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const ok = await endStream(req.userId!, id);
      return reply.send({ ok });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/streams/active
  app.get('/streams/active', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const result = await getActiveStreams(req.userId!, limit ? parseInt(limit) : 20);
      return reply.send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/streams/:id
  app.get('/streams/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const stream = await getStream(id, req.userId!);
      if (!stream) return reply.code(404).send({ error: 'Stream no encontrado' });
      return reply.send({ stream });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
