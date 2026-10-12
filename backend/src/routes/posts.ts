// ============================================================
// posts.ts - Rutas HTTP de posts
// ============================================================

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  createPost, getFeed,
  getReels, getUserPosts, deletePost,
  likePost, unlikePost,
} from '../services/postService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const createPostSchema = z.object({
  body: z.string().max(5000).nullable().optional(),
  imageUrl: z.string().max(500).nullable().optional(),
  videoUrl: z.string().max(500).nullable().optional(),
  visibility: z.enum(['public', 'followers', 'private']).default('followers'),
}).refine((d) => d.body || d.imageUrl || d.videoUrl, {
  message: 'El post debe tener texto o imagen',
});

export async function postRoutes(app: FastifyInstance) {
  // POST /api/posts
  app.post('/posts', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await createPost(req.userId!, parsed.data);
      return reply.code(201).send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/feed
  app.get('/feed', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit, offset, hashtag } = req.query as any;
    try {
      const posts = await getFeed(req.userId!, {
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
        hashtag,
      });
      return reply.send({ posts });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/reels — posts con video
  app.get('/reels', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit, offset } = req.query as any;
    try {
      const reels = await getReels(req.userId!, {
        limit: limit ? parseInt(limit) : 30,
        offset: offset ? parseInt(offset) : 0,
      });
      return reply.send(reels);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });


  // GET /api/users/:id/posts
  app.get('/users/:id/posts', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      return reply.send({ posts: await getUserPosts(id) });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/posts/:id
  app.delete('/posts/:id', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const ok = await deletePost(id, req.userId!);
    if (!ok) return reply.code(404).send({ error: 'Post no encontrado' });
    return reply.send({ ok: true });
  });

  // POST /api/posts/:id/like
  app.post('/posts/:id/like', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await likePost(id, req.userId!);
    return reply.send({ ok: true });
  });

  // DELETE /api/posts/:id/like
  app.delete('/posts/:id/like', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await unlikePost(id, req.userId!);
    return reply.send({ ok: true });
  });
}
