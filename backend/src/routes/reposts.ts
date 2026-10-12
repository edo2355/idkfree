// ============================================================
// reposts.ts — Republicar + dibujos sobre posts
// ============================================================
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { repostPost, getDrawings, createDrawing, deleteDrawing } from '../services/repostService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const repostSchema = z.object({
  body: z.string().max(500).nullable().optional(),
});

const drawingSchema = z.object({
  drawingUrl: z.string().max(500),
});

export async function repostRoutes(app: FastifyInstance) {
  // POST /api/posts/:id/repost
  app.post('/posts/:id/repost', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = repostSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await repostPost(req.userId!, id, parsed.data.body ?? undefined);
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'POST_NOT_FOUND') return reply.code(404).send({ error: 'Post no encontrado' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/posts/:id/drawings
  app.get('/posts/:id/drawings', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const result = await getDrawings(id);
      return reply.send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/posts/:id/drawings
  app.post('/posts/:id/drawings', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = drawingSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await createDrawing(req.userId!, id, parsed.data.drawingUrl);
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'POST_NOT_FOUND') return reply.code(404).send({ error: 'Post no encontrado' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/drawings/:id
  app.delete('/drawings/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const ok = await deleteDrawing(req.userId!, id);
      return reply.send({ ok });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
