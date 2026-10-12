// ============================================================
// stories.ts — Rutas HTTP de historias 24h
// ============================================================
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createStory, getStoriesFeed, getStoryById, deleteStory } from '../services/storiesService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const createStorySchema = z.object({
  mediaUrl: z.string().max(500),
  mediaType: z.enum(['image', 'video']),
});

export async function storyRoutes(app: FastifyInstance) {
  // POST /api/stories
  app.post('/stories', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const parsed = createStorySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await createStory(req.userId!, parsed.data);
      return reply.code(201).send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/stories/feed
  app.get('/stories/feed', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      const stories = await getStoriesFeed(req.userId!);
      return reply.send(stories);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/stories/:id
  app.get('/stories/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const story = await getStoryById(id, req.userId!);
      if (!story) return reply.code(404).send({ error: 'Historia no encontrada o expirada' });
      return reply.send({ story });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/stories/:id
  app.delete('/stories/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const ok = await deleteStory(id, req.userId!);
      return reply.send({ ok });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
