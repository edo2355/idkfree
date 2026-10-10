// ============================================================
// legacy.ts - Rutas HTTP del Modo Legado
// ============================================================

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  activateLegacy, deactivateLegacy, getMyLegacyInfo,
} from '../services/legacyService.js';
import { requireAuth } from '../middleware/auth.js';

const activateSchema = z.object({
  message: z.string().max(500).nullable().optional(),
}).strict();

export async function legacyRoutes(app: FastifyInstance) {

  // POST /api/me/legacy — activar modo legado
  app.post('/me/legacy', { preHandler: [requireAuth] }, async (req, reply) => {
    const parsed = activateSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      await activateLegacy(req.userId!, parsed.data.message ?? null);
      return reply.send({ ok: true, legacy: true });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/me/legacy — desactivar modo legado
  app.delete('/me/legacy', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      await deactivateLegacy(req.userId!);
      return reply.send({ ok: true, legacy: false });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/me/legacy — ver estado actual
  app.get('/me/legacy', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      const info = await getMyLegacyInfo(req.userId!);
      if (!info) return reply.code(404).send({ error: 'Usuario no encontrado' });
      return reply.send({
        legacy: info.legacy_mode === 1,
        message: info.legacy_message,
        activated_at: info.legacy_activated_at,
      });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
