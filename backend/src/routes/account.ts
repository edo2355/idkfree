import { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';

export async function accountRoutes(app: FastifyInstance) {
  app.delete('/auth/account', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const userId = (req.user as any).id;
    try {
      // Borrar datos relacionados (cascade manual)
      await query('DELETE FROM catalog_items WHERE user_id = ?', [userId]);
      await query('DELETE FROM user_payment_accounts WHERE user_id = ?', [userId]);
      await query('DELETE FROM posts WHERE user_id = ?', [userId]);
      await query('DELETE FROM users WHERE id = ?', [userId]);
      return reply.send({ ok: true, message: 'Cuenta eliminada permanentemente' });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al eliminar cuenta' });
    }
  });
}
