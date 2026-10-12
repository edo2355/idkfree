// ============================================================
// profile.ts - Rutas HTTP de perfil de usuario
// ============================================================

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  getProfileByAlias,
  updateProfile,
  changePassword,
  VALID_ACCENTS,
} from '../services/profileService.js';
import { requireAuth } from '../middleware/auth.js';

// ------------------------------------------------------------
// Schemas de validación
// ------------------------------------------------------------
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).nullable().optional(),
  bio: z.string().max(300).nullable().optional(),
  avatar_url: z.string().max(500).nullable().optional(),
  accent_color: z.enum(VALID_ACCENTS).optional(),
}).strict();

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(12).max(128)
    .regex(/[a-z]/, 'Debe tener una minúscula')
    .regex(/[A-Z]/, 'Debe tener una mayúscula')
    .regex(/\d/, 'Debe tener un número'),
}).strict();

// ------------------------------------------------------------
// Rutas
// ------------------------------------------------------------
export async function profileRoutes(app: FastifyInstance) {

  // GET /api/users/:alias — perfil público
  app.get('/users/:alias', async (req, reply) => {
    const { alias } = req.params as { alias: string };

    // Viewer opcional: si mandan token, sabemos si le sigue
    let viewerId: string | undefined;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      try {
        const payload = await req.jwtVerify<{ sub: string; alias: string }>();
        viewerId = payload.sub;
      } catch {
        // token inválido no rompe la request, solo no hay viewer
      }
    }

    try {
      const profile = await getProfileByAlias(alias, viewerId);
      if (!profile) return reply.code(404).send({ error: 'Usuario no encontrado' });
      return reply.send(profile);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // PATCH /api/me/profile — editar perfil propio
  app.patch('/me/profile', { preHandler: [requireAuth] }, async (req, reply) => {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }

    try {
      const updated = await updateProfile(req.userId!, parsed.data);
      if (!updated) return reply.code(400).send({ error: 'Nada que actualizar' });
      return reply.send({ user: updated });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/me/change-password
  app.post('/me/change-password', { preHandler: [requireAuth] }, async (req, reply) => {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }

    try {
      const result = await changePassword(
        req.userId!,
        parsed.data.current_password,
        parsed.data.new_password
      );

      if (result === 'NOT_FOUND') return reply.code(404).send({ error: 'Usuario no encontrado' });
      if (result === 'INVALID_CURRENT') return reply.code(401).send({ error: 'Contraseña actual incorrecta' });
      return reply.send({ ok: true });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
