import { query } from '../db/pool.js';
// ============================================================
// vibes.ts - Rutas HTTP de vibes
// ============================================================

import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
  createVibe, getActiveVibes, getVibeById, deleteVibe,
  resonateVibe, unresonateVibe, getUserActiveVibes, getMatches,
  VALID_MOODS,
} from '../services/vibeService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const createVibeSchema = z.object({
  mood: z.enum(VALID_MOODS),
  message: z.string().max(140).nullable().optional(),
}).strict();

async function optionalViewer(req: FastifyRequest): Promise<string | null> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = await req.jwtVerify<{ sub: string; alias: string }>();
    return payload.sub;
  } catch {
    return null;
  }
}

export async function vibeRoutes(app: FastifyInstance) {

  // POST /api/vibes — crear vibe
  app.post('/vibes', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const parsed = createVibeSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await createVibe(req.userId!, parsed.data);
      return reply.code(201).send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/vibes — feed
  app.get('/vibes', async (req, reply) => {
    const { limit, offset } = req.query as { limit?: string; offset?: string };
    const parsedLimit = Math.min(parseInt(limit ?? '50') || 50, 100);
    const parsedOffset = parseInt(offset ?? '0') || 0;
    const viewerId = await optionalViewer(req);

    try {
      const vibes = await getActiveVibes(viewerId, parsedLimit, parsedOffset);
      return reply.send({ vibes, count: vibes.length });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/vibes/matches — resonancias mutuas (antes que /vibes/:id)
  app.get('/vibes/matches', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      const matches = await getMatches(req.userId!);
      return reply.send({ matches, count: matches.length });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/vibes/:id
  app.delete('/vibes/:id', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const ok = await deleteVibe(id, req.userId!);
      if (!ok) return reply.code(404).send({ error: 'Vibe no encontrada' });
      return reply.send({ ok: true });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/vibes/:id/resonate
  app.post('/vibes/:id/resonate', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const vibe = await getVibeById(id);
      if (!vibe) return reply.code(404).send({ error: 'Vibe no encontrada' });
      await resonateVibe(id, req.userId!);
      return reply.send({ ok: true });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/vibes/:id/resonate
  app.delete('/vibes/:id/resonate', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      await unresonateVibe(id, req.userId!);
      return reply.send({ ok: true });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/users/:alias/vibes
  app.get('/users/:alias/vibes', async (req, reply) => {
    const { alias } = req.params as { alias: string };
    const viewerId = await optionalViewer(req);
    try {
      const vibes = await getUserActiveVibes(alias, viewerId);
      return reply.send({ vibes, count: vibes.length });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/vibes/all — todas las vibes (público)
  app.get('/vibes/all', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const res = await query(
        `SELECT v.id, v.user_id, v.mood, v.message, v.created_at,
                u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar,
                (SELECT COUNT(*) FROM vibe_resonances WHERE vibe_id = v.id) AS resonances_count
         FROM vibes v
         JOIN users u ON u.id = v.user_id
         WHERE v.deleted_at IS NULL
         ORDER BY v.created_at DESC
         LIMIT $1`,
        [limit ? parseInt(limit) : 50]
      );
      return reply.send({ vibes: res.rows });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/vibes/legacy — vibes en modo legado
  app.get('/vibes/legacy', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const res = await query(
        `SELECT v.id, v.user_id, v.mood, v.message, v.created_at,
                u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
         FROM vibes v
         JOIN users u ON u.id = v.user_id
         WHERE v.deleted_at IS NULL
           AND u.legacy_mode = 1
         ORDER BY v.created_at DESC
         LIMIT $1`,
        [limit ? parseInt(limit) : 50]
      );
      return reply.send({ vibes: res.rows });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
