import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  createComment, getComments, getReplies,
  deleteComment, likeComment, unlikeComment,
} from '../services/commentService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const createCommentSchema = z.object({
  body: z.string().max(5000).optional(),
  mediaType: z.enum(['audio', 'photo', 'gif', 'video', 'text']).optional(),
  mediaUrl: z.string().url().max(500).optional(),
  mediaDuration: z.number().int().positive().optional(),
  parentId: z.string().uuid().optional(),
}).refine((d) => d.body || d.mediaUrl, {
  message: 'El comentario debe tener texto o media',
});

export async function commentRoutes(app: FastifyInstance) {
  app.post('/posts/:postId/comments', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { postId } = req.params as { postId: string };
    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await createComment(postId, req.userId!, parsed.data);
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'POST_NOT_FOUND') {
        return reply.code(404).send({ error: 'Post no encontrado' });
      }
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  app.get('/posts/:postId/comments', async (req, reply) => {
    const { postId } = req.params as { postId: string };
    const { limit, offset } = req.query as any;
    try {
      const comments = await getComments(
        postId,
        limit ? parseInt(limit) : 50,
        offset ? parseInt(offset) : 0
      );
      return reply.send({ comments });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  app.get('/comments/:id/replies', async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      return reply.send({ replies: await getReplies(id) });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  app.delete('/comments/:id', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const ok = await deleteComment(id, req.userId!);
    if (!ok) return reply.code(404).send({ error: 'Comentario no encontrado' });
    return reply.send({ ok: true });
  });

  app.post('/comments/:id/like', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await likeComment(id, req.userId!);
    return reply.send({ ok: true });
  });

  app.delete('/comments/:id/like', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await unlikeComment(id, req.userId!);
    return reply.send({ ok: true });
  });
}
