import { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';

export async function accountRoutes(app: FastifyInstance) {
  app.delete('/auth/account', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const userId = (req.user as any).id;
    try {
      // Soft Delete: Marcamos la cuenta como eliminada
      await query('UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
      await query('DELETE FROM user_credentials WHERE user_id = ?', [userId]);
      
      // Opcional: Borrar datos sensibles o desactivar publicaciones
      await query('UPDATE catalog_items SET status = "paused" WHERE user_id = ?', [userId]);
      
      return reply.send({ ok: true, message: 'Cuenta eliminada permanentemente (Soft Delete)' });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al eliminar cuenta' });
    }
  });
}
