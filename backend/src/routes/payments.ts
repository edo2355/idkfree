import { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import crypto from 'crypto';

export async function paymentRoutes(app: FastifyInstance) {
  // ---- RUTA: GUARDAR CUENTA DE COBRO ----
  app.post('/payments/accounts', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { provider, account_data } = req.body as any;
    const userId = (req.user as any).id;
    try {
      await db.execute({
        sql: 'INSERT OR REPLACE INTO user_payment_accounts (id, user_id, provider, account_data) VALUES (?, ?, ?, ?)',
        args: [crypto.randomUUID(), userId, provider, account_data]
      });
      return reply.send({ ok: true });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al guardar cuenta' });
    }
  });

  // ---- RUTA: CREAR PAGO (QvaPay/Stripe) ----
  app.post('/payments/create', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { amount, currency, provider, metadata } = req.body as any;
    // Lógica de creación de factura (simulada por ahora)
    return reply.send({ url: `https://qvapay.com/pay/simulated_${Date.now()}`, id: 'sim_123' });
  });

  // ---- RUTA: ENVIAR DINERO (Transfermóvil, etc) ----
  app.post('/payments/send', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { provider, amount, receiver_account } = req.body as any;
    const userId = (req.user as any).id;
    const transferId = crypto.randomUUID();

    try {
      await db.execute({
        sql: 'INSERT INTO money_transfers (id, sender_id, receiver_account, provider, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
        args: [transferId, userId, receiver_account, provider, amount, 'pending']
      });
      return reply.send({ ok: true, transferId });
    } catch (err) {
      return reply.code(500).send({ error: 'Error al registrar envío' });
    }
  });
}
