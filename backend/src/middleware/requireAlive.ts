// ============================================================
// requireAlive.ts
// Bloquea acciones si el usuario está en modo legado
// ============================================================

import type { FastifyRequest, FastifyReply } from 'fastify';
import { isUserInLegacyMode } from '../services/legacyService.js';

export async function requireAlive(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!req.userId) return; // requireAuth debe correr antes
  const legacy = await isUserInLegacyMode(req.userId);
  if (legacy) {
    return reply.code(403).send({
      error: 'Tu cuenta está en modo legado. Está congelada y no permite nuevas acciones.',
    });
  }
}
