import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  checkAliasAvailability,
  checkReferralCode,
  joinWaitlist,
  getWaitlistStats,
  getWaitlistCard,
} from '../services/waitlistService.js';

export async function waitlistRoutes(app: FastifyInstance) {
  // 1. Validar alias en vivo
  app.get('/waitlist/check-alias', async (req, reply) => {
    const { alias } = req.query as { alias?: string };
    if (!alias) return reply.code(400).send({ error: 'Alias requerido' });
    try {
      return reply.send(await checkAliasAvailability(alias));
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // 2. Validar código de referido en vivo
  app.get('/waitlist/check-referral', async (req, reply) => {
    const { code } = req.query as { code?: string };
    if (!code) return reply.code(400).send({ error: 'Código requerido' });
    try {
      return reply.send(await checkReferralCode(code));
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // 3. Registrarse en la lista
  app.post('/waitlist/join', async (req, reply) => {
    const schema = z.object({
      alias: z.string().min(3).max(30),
      email: z.string().email().optional().or(z.literal('')),
      referred_by: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await joinWaitlist(
        parsed.data.alias,
        parsed.data.email || undefined,
        parsed.data.referred_by || undefined
      );
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'ALIAS_TAKEN') return reply.code(409).send({ error: 'Este alias ya está en la lista' });
      if (err.message === 'INVALID_REFERRAL') return reply.code(400).send({ error: 'Código de referido inválido' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // 4. Stats para la landing
  app.get('/waitlist/stats', async (req, reply) => {
    try {
      reply.header('Cache-Control', 'public, max-age=60');
      return reply.send(await getWaitlistStats());
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // 5. Card extendido con gamificación
  app.get('/waitlist/card/:code', async (req, reply) => {
    const { code } = req.params as { code: string };
    try {
      return reply.send(await getWaitlistCard(code));
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return reply.code(404).send({ error: 'Pase no encontrado' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
