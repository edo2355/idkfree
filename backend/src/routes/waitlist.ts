import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { checkAliasAvailability, joinWaitlist, getWaitlistStats } from '../services/waitlistService.js';

export async function waitlistRoutes(app: FastifyInstance) {
  
  // 1. Validar alias en vivo
  app.get('/waitlist/check-alias', async (req, reply) => {
    const { alias } = req.query as { alias?: string };
    if (!alias) return reply.code(400).send({ error: 'Alias requerido' });
    
    try {
      const result = await checkAliasAvailability(alias);
      return reply.send(result);
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // 2. Registrarse en la lista
  app.post('/waitlist/join', async (req, reply) => {
    const schema = z.object({
      alias: z.string().min(3).max(30),
      email: z.string().email().optional().or(z.literal('')),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }

    try {
      const result = await joinWaitlist(parsed.data.alias, parsed.data.email || undefined);
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'ALIAS_TAKEN') {
        return reply.code(409).send({ error: 'Este alias ya está en la lista' });
      }
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // 3. Estadísticas para la landing
  app.get('/waitlist/stats', async (req, reply) => {
    try {
      const stats = await getWaitlistStats();
      // Cache en memoria por 60 seg
      reply.header('Cache-Control', 'public, max-age=60');
      return reply.send(stats);
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
