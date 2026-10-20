import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

export async function adminRoutes(app: FastifyInstance) {
  // Middleware interno para verificar rol
  async function checkAdmin(req: any, reply: any) {
    const res = await query('SELECT role FROM users WHERE id = $1', [req.userId]);
    const role = res.rows[0]?.role;
    if (role !== 'admin' && role !== 'support' && role !== 'owner') {
      return reply.code(403).send({ error: 'Acceso denegado. Solo personal autorizado.' });
    }
  }

  // GET /api/admin/users — Lista de todos los usuarios
  app.get('/admin/users', { preHandler: [requireAuth, checkAdmin] }, async (req, reply) => {
    try {
      const res = await query(`
        SELECT id, alias, name, email, account_type, role, created_at,
        (SELECT COUNT(*) FROM posts WHERE author_id = users.id) as posts_count
        FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 50
      `);
      return reply.send({ users: res.rows });
    } catch (err) {
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/admin/stats — Métricas generales
  app.get('/admin/stats', { preHandler: [requireAuth, checkAdmin] }, async (req, reply) => {
    try {
      const users = await query('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL');
      const posts = await query('SELECT COUNT(*) FROM posts WHERE deleted_at IS NULL');
      const messages = await query('SELECT COUNT(*) FROM direct_messages');
      return reply.send({
        total_users: Number(users.rows[0].count),
        total_posts: Number(posts.rows[0].count),
        total_messages: Number(messages.rows[0].count),
      });
    } catch (err) {
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
