import type { FastifyInstance } from 'fastify';
import { createInvoice, handleWebhook } from '../services/qvapayService.js';
import { requireAuth } from '../middleware/auth.js';

export async function qvapayRoutes(app: FastifyInstance) {
  app.post('/qvapay/create-invoice', { preHandler: [requireAuth] }, async (req, reply) => {
    const { amount, description } = req.body as { amount: number, description: string };
    const userId = (req as any).userId;
    try {
      const result = await createInvoice(userId, amount, description);
      return reply.send(result);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error generando factura' });
    }
  });

  app.post('/qvapay/webhook', async (req, reply) => {
    try {
      console.log('🔔 Webhook recibido:', req.body);
      await handleWebhook(req.body);
      return reply.send({ status: 'ok' });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error en webhook' });
    }
  });
}
