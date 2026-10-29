import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';

async function adminOnly(req: any, reply: any) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: 'No autenticado' });
  }
  const role = (await query('SELECT role FROM users WHERE id = $1', [req.user?.sub])).rows[0]?.role;
  if (!['owner', 'admin', 'kyc_manager'].includes(role)) {
    return reply.code(403).send({ error: 'Solo admin' });
  }
}

export async function crossBorderAdminRoutes(app: FastifyInstance) {
  app.get('/admin/cross-border/suppliers/pending', { preHandler: [adminOnly] }, async (_req, reply) => {
    const r = await query(
      `SELECT id, user_id, company_name, country_code, categories, created_at
       FROM supplier_profiles WHERE verified_at IS NULL
       ORDER BY created_at ASC LIMIT 100`
    );
    return reply.send({ pending: r.rows });
  });

  app.post('/admin/cross-border/suppliers/:id/verify', { preHandler: [adminOnly] }, async (req: any, reply) => {
    const adminId = req.user.sub;
    const { id } = req.params;
    const r = await query(
      `UPDATE supplier_profiles SET verified_at = datetime('now'), verified_by = $1
       WHERE id = $2 RETURNING id, company_name, verified_at`,
      [adminId, id]
    );
    if (r.rows.length === 0) return reply.code(404).send({ error: 'Supplier no encontrado' });
    return reply.send({ supplier: r.rows[0] });
  });

  app.get('/admin/cross-border/influencers/pending', { preHandler: [adminOnly] }, async (_req, reply) => {
    const r = await query(
      `SELECT id, user_id, niche, platforms, followers_count, country_code, created_at
       FROM influencer_profiles WHERE verified_at IS NULL
       ORDER BY created_at ASC LIMIT 100`
    );
    return reply.send({ pending: r.rows });
  });

  app.post('/admin/cross-border/influencers/:id/verify', { preHandler: [adminOnly] }, async (req: any, reply) => {
    const adminId = req.user.sub;
    const { id } = req.params;
    const r = await query(
      `UPDATE influencer_profiles SET verified_at = datetime('now'), verified_by = $1
       WHERE id = $2 RETURNING id, niche, followers_count, verified_at`,
      [adminId, id]
    );
    if (r.rows.length === 0) return reply.code(404).send({ error: 'Influencer no encontrado' });
    return reply.send({ influencer: r.rows[0] });
  });
}
