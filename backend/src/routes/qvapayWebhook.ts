import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { query } from '../db/pool.js';

export async function qvapayWebhookRoutes(app: FastifyInstance) {
  app.post('/payments/qvapay/webhook', async (req, reply) => {
    // 1. Firma
    const signature = req.headers['x-qvapay-signature'] as string;
    if (!signature) {
      return reply.code(401).send({ error: 'Firma no proporcionada' });
    }

    const rawBody = (req as any).rawBody as string;
    if (!rawBody) {
      app.log.error('❌ Webhook sin rawBody');
      return reply.code(500).send({ error: 'Error de configuración interna' });
    }

    const appSecret = process.env.QVAPAY_APP_SECRET;
    if (!appSecret) {
      app.log.error('❌ QVAPAY_APP_SECRET no configurado');
      return reply.code(500).send({ error: 'Servidor mal configurado' });
    }

    // 2. HMAC
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(rawBody);
    const calculatedSignature = hmac.digest('hex');

    // 3. Comparar con timingSafeEqual
    const sigBuf = Buffer.from(signature, 'hex');
    const calcBuf = Buffer.from(calculatedSignature, 'hex');
    const isValid = sigBuf.length === calcBuf.length && crypto.timingSafeEqual(sigBuf, calcBuf);

    if (!isValid) {
      app.log.warn('❌ Firma QvaPay inválida');
      return reply.code(401).send({ error: 'Firma inválida' });
    }

    // 4. Procesar pago real
    const payload = req.body as any;
    app.log.info(`✅ Webhook QvaPay: orden=${payload.remote_id} estado=${payload.status} monto=${payload.amount}`);

    try {
      if (payload.status === 'PAID' || payload.status === 'COMPLETED') {
        await query(
          `UPDATE orders SET status = 'paid' WHERE id = ?`,
          [payload.remote_id]
        );
        app.log.info(`💳 Orden ${payload.remote_id} marcada como PAGADA`);
      } else if (payload.status === 'CANCELLED' || payload.status === 'FAILED') {
        await query(
          `UPDATE orders SET status = 'failed' WHERE id = ?`,
          [payload.remote_id]
        );
        app.log.info(`❌ Orden ${payload.remote_id} marcada como FALLIDA`);
      }
    } catch (err: any) {
      app.log.error('Error actualizando orden:', err);
    }

    return reply.code(200).send({ received: true });
  });
}
