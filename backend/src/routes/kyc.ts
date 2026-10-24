import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

export async function kycRoutes(app: FastifyInstance) {
  // Enviar verificación KYC (write → bloqueado en legacy mode)
  app.post(
    '/kyc/submit',
    { preHandler: [requireAuth, requireAlive], bodyLimit: 5 * 1024 * 1024 },
    async (req, reply) => {
      const userId = req.userId!;
      const { document_type, document_number, document_photo, selfie_photo } =
        req.body as any;

      if (!document_type || !document_number) {
        return reply
          .code(400)
          .send({ error: 'Tipo y número de documento son requeridos' });
      }

      try {
        const existing = await query(
          'SELECT id FROM kyc_verifications WHERE user_id = $1',
          [userId]
        );

        if (existing.rows.length > 0) {
          await query(
            `UPDATE kyc_verifications
             SET document_type = $1, document_number = $2,
                 document_photo = $3, selfie_photo = $4,
                 status = 'pending', submitted_at = CURRENT_TIMESTAMP
             WHERE user_id = $5`,
            [
              document_type,
              document_number,
              document_photo || null,
              selfie_photo || null,
              userId,
            ]
          );
        } else {
          await query(
            `INSERT INTO kyc_verifications
             (id, user_id, document_type, document_number, document_photo, selfie_photo, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
            [
              crypto.randomUUID(),
              userId,
              document_type,
              document_number,
              document_photo || null,
              selfie_photo || null,
            ]
          );
        }

        return reply.send({
          ok: true,
          message: 'Verificación enviada. Pendiente de revisión.',
        });
      } catch (err) {
        app.log.error({ err }, 'Error en kyc/submit');
        return reply.code(500).send({ error: 'Error interno al enviar KYC' });
      }
    }
  );

  // Consultar estado (read → solo auth)
  app.get(
    '/kyc/status',
    { preHandler: [requireAuth] },
    async (req, reply) => {
      const userId = req.userId!;
      try {
        const res = await query(
          'SELECT status, admin_notes FROM kyc_verifications WHERE user_id = $1',
          [userId]
        );
        if (res.rows.length === 0) return reply.send({ status: 'not_submitted' });
        return reply.send(res.rows[0]);
      } catch (err) {
        app.log.error({ err }, 'Error en kyc/status');
        return reply.code(500).send({ error: 'Error interno' });
      }
    }
  );
}
