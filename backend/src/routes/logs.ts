import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import crypto from 'crypto';

export async function logRoutes(app: FastifyInstance) {
  app.post('/logs/error', async (req, reply) => {
    const { error_message, stack_trace, device_model, os_version, app_version } = req.body as any;
    try {
      await query(
        `INSERT INTO device_logs (id, user_id, error_message, stack_trace, device_model, os_version, app_version) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [crypto.randomUUID(), null, error_message, stack_trace, device_model, os_version, app_version]
      );
      return reply.send({ ok: true });
    } catch (err) {
      return reply.code(500).send({ error: 'Error guardando log' });
    }
  });
}
