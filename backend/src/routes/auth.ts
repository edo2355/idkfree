import type { FastifyInstance } from 'fastify';
import { register, verifyLogin } from '../services/authService.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { query } from '../db/pool.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const result = await register(parsed.data as any);
      return reply.code(201).send({
        ...result,
        warning: 'Guarda los 3 QRs y los 3 PINs del carnet AHORA. Los 3 PINs secretos no se muestran — solo tú los sabes.',
      });
    } catch (err: any) {
      if (err.message === 'EMAIL_OR_ALIAS_TAKEN') return reply.code(409).send({ error: 'Email o alias ya está en uso' });
      if (err.message.includes('PIN')) return reply.code(400).send({ error: err.message });
      app.log.error(err); return reply.code(500).send({ error: 'Error interno' });
    }
  });

  app.post('/auth/login', async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    try {
      const { userId, alias } = await verifyLogin(parsed.data.email, parsed.data.password);
      const accessToken = app.jwt.sign({ sub: userId, alias }, { expiresIn: '15m' });
      return reply.send({ userId, alias, accessToken });
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') return reply.code(401).send({ error: 'Credenciales inválidas' });
      app.log.error(err); return reply.code(500).send({ error: 'Error interno' });
    }
  });

  app.get('/auth/me', async (req, reply) => {
    try {
      const payload = await req.jwtVerify<{ sub: string; alias: string }>();
      const res = await query('SELECT id, alias, name, bio, avatar_url, created_at FROM users WHERE id = $1', [payload.sub]);
      if (res.rows.length === 0) return reply.code(404).send({ error: 'Usuario no encontrado' });
      return reply.send({ user: res.rows[0] });
    } catch { return reply.code(401).send({ error: 'No autenticado' }); }
  });
}
