import { FastifyInstance } from 'fastify';
import crypto from 'crypto';

export async function qvapayWebhookRoutes(app: FastifyInstance) {
  app.post('/payments/qvapay/webhook', async (req, reply) => {
    // 1. Obtener la firma del header
    const signature = req.headers['x-qvapay-signature'] as string;
    if (!signature) {
      return reply.code(401).send({ error: 'Firma no proporcionada' });
    }

    // 2. Obtener el cuerpo crudo (raw body) para calcular el HMAC
    // En Fastify, esto se hace con el content-type parser correspondiente.
    // Si no lo tienes configurado, puedes usar JSON.stringify(req.body) como aproximación,
    // pero lo ideal es usar el raw body.
    const rawBody = JSON.stringify(req.body); // Aproximación segura si no hay raw body
    const appSecret = process.env.QVAPAY_APP_SECRET || 'tu_app_secret';

    // 3. Calcular HMAC-SHA256
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(rawBody);
    const calculatedSignature = hmac.digest('hex');

    // 4. Comparar firmas
    if (calculatedSignature !== signature) {
      app.log.warn('❌ Firma de QvaPay inválida');
      return reply.code(401).send({ error: 'Firma inválida' });
    }

    // 5. Firma válida: procesar el pago
    const payload = req.body as any;
    app.log.info(`✅ Webhook QvaPay recibido: Orden ${payload.remote_id}, Estado: ${payload.status}`);

    // Aquí actualizas tu base de datos (Turso) para marcar el pedido como pagado.
    // Por ejemplo:
    // await db.execute({ sql: 'UPDATE orders SET status = ? WHERE id = ?', args: ['paid', payload.remote_id] });

    return reply.code(200).send({ received: true });
  });
}
