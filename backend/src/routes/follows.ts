// ============================================================
// follows.ts - Rutas HTTP de follows
// ============================================================

import type { FastifyInstance } from 'fastify';
import {
  follow, unfollow, getFollowers, getFollowing,
} from '../services/followService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

export async function followRoutes(app: FastifyInstance) {
  // POST /api/users/:id/follow
  app.post('/users/:id/follow', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      await follow(req.userId!, id);
      return reply.send({ ok: true });
    } catch (err: any) {
      if (err.message === 'NO_SELF_FOLLOW') {
        return reply.code(400).send({ error: 'No puedes seguirte a ti mismo' });
      }
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/users/:id/follow
  app.delete('/users/:id/follow', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await unfollow(req.userId!, id);
    return reply.send({ ok: true });
  });

  // GET /api/users/:id/followers
  app.get('/users/:id/followers', async (req, reply) => {
    const { id } = req.params as { id: string };
    return reply.send({ followers: await getFollowers(id) });
  });

  // GET /api/users/:id/following
  app.get('/users/:id/following', async (req, reply) => {
    const { id } = req.params as { id: string };
    return reply.send({ following: await getFollowing(id) });
  });
}
