import { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import crypto from 'crypto';

const WEBHOOK_URL = 'https://idkfreegetid.dpdns.org/api/payments/qvapay/webhook';

export async function paymentRoutes(app: FastifyInstance) {
  // ---- GUARDAR CUENTA DE COBRO ----
  app.post('/payments/accounts', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { provider, account_data } = req.body as any;
    const userId = (req.user as any).id;
    try {
      await query(
        'INSERT OR REPLACE INTO user_payment_accounts (id, user_id, provider, account_data) VALUES (?, ?, ?, ?)',
        [crypto.randomUUID(), userId, provider, JSON.stringify(account_data)]
      );
      return reply.send({ ok: true });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al guardar cuenta' });
    }
  });

  // ---- CREAR PAGO REAL EN QVAPAY ----
  app.post('/payments/create', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { amount, currency, provider = 'qvapay', description, orderId } = req.body as any;
    const userId = (req.user as any).id;

    if (!amount || amount <= 0) {
      return reply.code(400).send({ error: 'Monto inválido' });
    }

    try {
      // Importación dinámica para evitar cargar el provider si no se usa
      const { QvaPayProvider } = await import('../payments/providers/QvaPayProvider.js');
      const providerInstance = new QvaPayProvider(
        process.env.QVAPAY_APP_ID!,
        process.env.QVAPAY_APP_SECRET!
      );

      const result = await providerInstance.createPayment(amount, currency || 'USD', {
        description: description || 'Pago en IDKfree',
        orderId: orderId || crypto.randomUUID(),
        webhookUrl: WEBHOOK_URL,
      });

      // Guardar la orden en DB como pending
      await query(
        `INSERT INTO orders (id, buyer_id, seller_id, item_id, amount, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`,
        [result.id, userId, userId, orderId || 'qvapay_invoice', amount]
      );

      return reply.send({
        ok: true,
        id: result.id,
        url: result.url,
        status: result.status,
      });
    } catch (err: any) {
      app.log.error('[payments/create]', err);
      return reply.code(500).send({ error: 'Error al crear pago: ' + err.message });
    }
  });

  // ---- ENVIAR DINERO ----
  app.post('/payments/send', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { provider, amount, receiver_account } = req.body as any;
    const userId = (req.user as any).id;
    const transferId = crypto.randomUUID();

    try {
      await query(
        'INSERT INTO money_transfers (id, sender_id, receiver_account, provider, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
        [transferId, userId, receiver_account, provider, amount, 'pending']
      );
      return reply.send({ ok: true, transferId });
    } catch (err) {
      return reply.code(500).send({ error: 'Error al registrar envío' });
    }
  });
}
