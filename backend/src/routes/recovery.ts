import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { panicRecover, restoreRecover, fenixRecover, overridePendingDeletion, getRecoveryAudit } from '../services/recoveryService.js';
import { requireAuth } from '../middleware/auth.js';

const baseSchema = z.object({
  cardId: z.string().uuid(),
  secret: z.string().min(10),
  pin: z.string().regex(/^\d{4,8}$/),
});

const restoreSchema = baseSchema.extend({
  newPassword: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/),
});

export async function recoveryRoutes(app: FastifyInstance) {
  // POST /api/auth/recover/panic — bloquea la cuenta temporalmente
  app.post('/auth/recover/panic', async (req, reply) => {
    const parsed = baseSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const res = await panicRecover(parsed.data);
      return reply.send(res);
    } catch (err: any) {
      if (err.message === 'INVALID_CARD' || err.message === 'INVALID_QR' || err.message === 'INVALID_PIN') {
        return reply.code(401).send({ error: 'Carnet, QR o PIN incorrectos' });
      }
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/auth/recover/restore — cambia la contraseña
  app.post('/auth/recover/restore', async (req, reply) => {
    const parsed = restoreSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const res = await restoreRecover(parsed.data);
      return reply.send(res);
    } catch (err: any) {
      if (err.message === 'INVALID_CARD' || err.message === 'INVALID_QR' || err.message === 'INVALID_PIN') {
        return reply.code(401).send({ error: 'Carnet, QR o PIN incorrectos' });
      }
      if (err.message === 'WEAK_PASSWORD') return reply.code(400).send({ error: 'Contraseña muy débil' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/auth/recover/fenix — borra la cuenta
  app.post('/auth/recover/fenix', async (req, reply) => {
    const parsed = baseSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const res = await fenixRecover(parsed.data);
      return reply.send(res);
    } catch (err: any) {
      if (err.message === 'INVALID_CARD' || err.message === 'INVALID_QR' || err.message === 'INVALID_PIN') {
        return reply.code(401).send({ error: 'Carnet, QR o PIN incorrectos' });
      }
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/recovery/override — dueño revierte acción hecha con código impreso
  app.post('/recovery/override', { preHandler: [requireAuth] }, async (req, reply) => {
    const { cardId, pin } = req.body as { cardId?: string; pin?: string };
    if (!cardId || !pin) {
      return reply.code(400).send({ error: 'cardId y pin requeridos' });
    }
    try {
      const ip = (req.headers['x-forwarded-for'] as string) ?? req.ip;
      const result = await overridePendingDeletion(cardId, pin, ip);
      return reply.send(result);
    } catch (err: any) {
      const code = err.message === 'INVALID_MENTAL_PIN' ? 401
        : err.message === 'INVALID_CARD' ? 404
        : 500;
      return reply.code(code).send({ error: err.message });
    }
  });

  // GET /api/recovery/audit/:cardId — historial de intentos del carnet
  app.get('/recovery/audit/:cardId', { preHandler: [requireAuth] }, async (req, reply) => {
    const { cardId } = req.params as { cardId: string };
    try {
      const audit = await getRecoveryAudit(cardId, 50);
      return reply.send({ audit });
    } catch (err: any) {
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
