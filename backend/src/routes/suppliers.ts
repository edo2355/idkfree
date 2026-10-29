import type { FastifyInstance } from 'fastify';
import { query, uuid } from '../db/pool.js';
import { isUserBlocked } from '../services/amlService.js';

export async function supplierRoutes(app: FastifyInstance) {
  // GET /suppliers — público con filtros
  app.get('/suppliers', async (req, reply) => {
    const q: any = req.query;
    const f: string[] = [];
    const args: any[] = [];
    let i = 1;

    if (q.country) { f.push(`country_code = $${i++}`); args.push(String(q.country).toUpperCase()); }
    if (q.category) { f.push(`categories LIKE $${i++}`); args.push(`%${q.category}%`); }
    if (q.verified === '1') f.push(`verified_at IS NOT NULL`);
    if (q.q) { f.push(`LOWER(company_name) LIKE $${i++}`); args.push(`%${String(q.q).toLowerCase()}%`); }

    const where = f.length ? `WHERE ${f.join(' AND ')}` : '';
    const lim = Math.min(parseInt(String(q.limit ?? '20')), 100);
    const off = parseInt(String(q.offset ?? '0'));

    const r = await query(
      `SELECT id, company_name, country_code, categories, min_order_value,
              currency, shipping_methods, website, description,
              (verified_at IS NOT NULL) AS verified, created_at
       FROM supplier_profiles ${where}
       ORDER BY (verified_at IS NOT NULL) DESC, created_at DESC
       LIMIT ${lim} OFFSET ${off}`,
      args
    );
    return reply.send({ suppliers: r.rows, total: r.rows.length });
  });

  // GET /suppliers/:id
  app.get('/suppliers/:id', async (req: any, reply) => {
    const { id } = req.params;
    const r = await query('SELECT * FROM supplier_profiles WHERE id = $1', [id]);
    if (r.rows.length === 0) return reply.code(404).send({ error: 'Supplier no encontrado' });

    const s: any = { ...r.rows[0] };
    let canSee = !!s.verified_at;

    try {
      const p = await req.jwtVerify() as any;
      if (p.sub === s.user_id) canSee = true;
      else {
        const role = await query('SELECT role FROM users WHERE id = $1', [p.sub]);
        if (['owner', 'admin', 'kyc_manager'].includes(role.rows[0]?.role)) canSee = true;
      }
    } catch { /* público */ }

    if (!canSee) {
      delete s.contact_whatsapp;
      delete s.contact_email;
      delete s.contact_wechat;
    }
    return reply.send({ supplier: s, contacts_visible: canSee });
  });

  // POST /suppliers/me — upsert
  app.post('/suppliers/me', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const userId = req.user.sub;
    if (await isUserBlocked(userId)) {
      return reply.code(403).send({ error: 'COMPLIANCE_RESTRICTED', message: 'Servicios financieros bajo revisión.' });
    }
    const b = req.body as any;
    if (!b.company_name) return reply.code(400).send({ error: 'company_name obligatorio' });

    const u = await query('SELECT country_code FROM users WHERE id = $1', [userId]);
    const cc = b.country_code || u.rows[0]?.country_code || 'CU';

    const ex = await query('SELECT id FROM supplier_profiles WHERE user_id = $1', [userId]);
    if (ex.rows.length > 0) {
      await query(
        `UPDATE supplier_profiles SET company_name=$1, country_code=$2, categories=$3,
         min_order_value=$4, currency=$5, shipping_methods=$6, contact_whatsapp=$7,
         contact_email=$8, contact_wechat=$9, website=$10, description=$11
         WHERE user_id=$12`,
        [b.company_name, cc, b.categories ?? null, b.min_order_value ?? null,
         b.currency ?? 'USD', b.shipping_methods ?? null, b.contact_whatsapp ?? null,
         b.contact_email ?? null, b.contact_wechat ?? null, b.website ?? null,
         b.description ?? null, userId]
      );
      const up = await query('SELECT * FROM supplier_profiles WHERE user_id = $1', [userId]);
      return reply.send({ supplier: up.rows[0] });
    }

    const id = uuid();
    await query(
      `INSERT INTO supplier_profiles
       (id, user_id, company_name, country_code, categories, min_order_value,
        currency, shipping_methods, contact_whatsapp, contact_email, contact_wechat,
        website, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [id, userId, b.company_name, cc, b.categories ?? null, b.min_order_value ?? null,
       b.currency ?? 'USD', b.shipping_methods ?? null, b.contact_whatsapp ?? null,
       b.contact_email ?? null, b.contact_wechat ?? null, b.website ?? null,
       b.description ?? null]
    );
    const cr = await query('SELECT * FROM supplier_profiles WHERE id = $1', [id]);
    return reply.code(201).send({ supplier: cr.rows[0] });
  });

  // GET /suppliers/me
  app.get('/suppliers/me', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const r = await query('SELECT * FROM supplier_profiles WHERE user_id = $1', [req.user.sub]);
    if (r.rows.length === 0) return reply.code(404).send({ error: 'Sin perfil de supplier' });
    return reply.send({ supplier: r.rows[0] });
  });
}
