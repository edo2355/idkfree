// ============================================================
// hashtags.ts - Rutas HTTP de hashtags
// ============================================================

import type { FastifyInstance } from 'fastify';
import {
  getTrendingHashtags,
  getHashtagByTag,
  getHashtagPosts,
} from '../services/hashtagService.js';

export async function hashtagRoutes(app: FastifyInstance) {

  // GET /api/hashtags/trending?limit=20&offset=0
  app.get('/hashtags/trending', async (req, reply) => {
    const { limit, offset } = req.query as { limit?: string; offset?: string };
    const parsedLimit = Math.min(parseInt(limit ?? '20') || 20, 50);
    const parsedOffset = parseInt(offset ?? '0') || 0;

    try {
      const hashtags = await getTrendingHashtags(parsedLimit, parsedOffset);
      return reply.send({ hashtags, count: hashtags.length });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/hashtags/:tag?limit=20&offset=0
  app.get('/hashtags/:tag', async (req, reply) => {
    const { tag } = req.params as { tag: string };
    const { limit, offset } = req.query as { limit?: string; offset?: string };
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
      const hashtag = await getHashtagByTag(tag);
      if (!hashtag) return reply.code(404).send({ error: 'Hashtag no encontrado' });

      const posts = await getHashtagPosts(tag, viewerId, parsedLimit, parsedOffset);
      return reply.send({ hashtag, posts, count: posts.length });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
