import type { FastifyInstance } from 'fastify';
import { query, uuid } from '../db/pool.js';
import { isUserBlocked } from '../services/amlService.js';

export async function influencerRoutes(app: FastifyInstance) {
  app.get('/influencers', async (req, reply) => {
    const q: any = req.query;
    const f: string[] = [];
    const args: any[] = [];
    let i = 1;

    if (q.country) { f.push(`country_code = $${i++}`); args.push(String(q.country).toUpperCase()); }
    if (q.niche) { f.push(`niche LIKE $${i++}`); args.push(`%${q.niche}%`); }
    if (q.verified === '1') f.push(`verified_at IS NOT NULL`);
    if (q.q) { f.push(`LOWER(niche) LIKE $${i++}`); args.push(`%${String(q.q).toLowerCase()}%`); }

    const where = f.length ? `WHERE ${f.join(' AND ')}` : '';
    const lim = Math.min(parseInt(String(q.limit ?? '20')), 100);
    const off = parseInt(String(q.offset ?? '0'));

    const r = await query(
      `SELECT id, niche, platforms, followers_count, rate_per_post, rate_per_live,
              currency, languages, country_code, description,
              (verified_at IS NOT NULL) AS verified, created_at
       FROM influencer_profiles ${where}
       ORDER BY (verified_at IS NOT NULL) DESC, followers_count DESC, created_at DESC
       LIMIT ${lim} OFFSET ${off}`,
      args
    );
    return reply.send({ influencers: r.rows, total: r.rows.length });
  });

  app.get('/influencers/:id', async (req, reply) => {
    const { id } = req.params;
    const r = await query('SELECT * FROM influencer_profiles WHERE id = $1', [id]);
    if (r.rows.length === 0) return reply.code(404).send({ error: 'Influencer no encontrado' });
    return reply.send({ influencer: r.rows[0] });
  });

  app.post('/influencers/me', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const userId = req.user.sub;
    if (await isUserBlocked(userId)) {
      return reply.code(403).send({ error: 'COMPLIANCE_RESTRICTED', message: 'Servicios financieros bajo revisión.' });
    }
    const b = req.body as any;

    const u = await query('SELECT country_code FROM users WHERE id = $1', [userId]);
    const cc = b.country_code || u.rows[0]?.country_code || 'CU';

    const ex = await query('SELECT id FROM influencer_profiles WHERE user_id = $1', [userId]);
    if (ex.rows.length > 0) {
      await query(
        `UPDATE influencer_profiles SET niche=$1, platforms=$2, followers_count=$3,
         rate_per_post=$4, rate_per_live=$5, currency=$6, languages=$7,
         country_code=$8, description=$9
         WHERE user_id=$10`,
        [b.niche ?? null, b.platforms ?? null, b.followers_count ?? 0,
         b.rate_per_post ?? null, b.rate_per_live ?? null, b.currency ?? 'USD',
         b.languages ?? null, cc, b.description ?? null, userId]
      );
      const up = await query('SELECT * FROM influencer_profiles WHERE user_id = $1', [userId]);
      return reply.send({ influencer: up.rows[0] });
    }

    const id = uuid();
    await query(
      `INSERT INTO influencer_profiles
       (id, user_id, niche, platforms, followers_count, rate_per_post, rate_per_live,
        currency, languages, country_code, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, userId, b.niche ?? null, b.platforms ?? null, b.followers_count ?? 0,
       b.rate_per_post ?? null, b.rate_per_live ?? null, b.currency ?? 'USD',
       b.languages ?? null, cc, b.description ?? null]
    );
    const cr = await query('SELECT * FROM influencer_profiles WHERE id = $1', [id]);
    return reply.code(201).send({ influencer: cr.rows[0] });
  });

  app.get('/influencers/me', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const r = await query('SELECT * FROM influencer_profiles WHERE user_id = $1', [req.user.sub]);
    if (r.rows.length === 0) return reply.code(404).send({ error: 'Sin perfil de influencer' });
    return reply.send({ influencer: r.rows[0] });
  });
}
