import type { FastifyInstance } from 'fastify';
import { getPosts, createPost, getProfile } from '../services/socialService.js';
import { requireAuth } from '../middleware/auth.js';

export async function socialRoutes(app: FastifyInstance) {
  // Obtener feed público
  app.get('/social/posts', async (req, reply) => {
    try {
      const posts = await getPosts();
      return reply.send(posts);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo posts' });
    }
  });

  // Crear post (requiere auth)
  app.post('/social/posts', { preHandler: [requireAuth] }, async (req, reply) => {
    const { content } = req.body as { content: string };
    const userId = (req as any).userId;
    try {
      const post = await createPost(userId, content);
      return reply.code(201).send(post);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando post' });
    }
  });

  // Obtener perfil del usuario autenticado
  app.get('/social/profile', { preHandler: [requireAuth] }, async (req, reply) => {
    const userId = (req as any).userId;
    try {
      const profile = await getProfile(userId);
      return reply.send(profile);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo perfil' });
    }
  });
}
