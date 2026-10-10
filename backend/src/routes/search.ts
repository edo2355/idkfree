// ============================================================
// search.ts - Rutas HTTP de búsqueda
// ============================================================

import type { FastifyInstance } from 'fastify';
import { searchUsers, searchPosts } from '../services/searchService.js';

export async function searchRoutes(app: FastifyInstance) {

  // GET /api/search/users?q=...&limit=20&offset=0
  app.get('/search/users', async (req, reply) => {
    const { q, limit, offset } = req.query as {
      q?: string; limit?: string; offset?: string;
    };

    if (!q || q.trim().length < 2) {
      return reply.code(400).send({ error: 'Mínimo 2 caracteres en q' });
    }

    const parsedLimit = Math.min(parseInt(limit ?? '20') || 20, 50);
    const parsedOffset = parseInt(offset ?? '0') || 0;

    try {
      const users = await searchUsers(q, parsedLimit, parsedOffset);
      return reply.send({ users, count: users.length });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/search/posts?q=...&limit=20&offset=0
  app.get('/search/posts', async (req, reply) => {
    const { q, limit, offset } = req.query as {
      q?: string; limit?: string; offset?: string;
    };

    if (!q || q.trim().length < 2) {
      return reply.code(400).send({ error: 'Mínimo 2 caracteres en q' });
    }

    const parsedLimit = Math.min(parseInt(limit ?? '20') || 20, 50);
    const parsedOffset = parseInt(offset ?? '0') || 0;

    // Viewer opcional (para filtrar por visibilidad)
    let viewerId: string | null = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      try {
        const payload = await req.jwtVerify<{ sub: string; alias: string }>();
        viewerId = payload.sub;
      } catch {
        // token inválido → seguimos como anónimo
      }
    }

    try {
      const posts = await searchPosts(q, viewerId, parsedLimit, parsedOffset);
      return reply.send({ posts, count: posts.length });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
