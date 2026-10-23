import { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import crypto from 'crypto';

export async function catalogRoutes(app: FastifyInstance) {
  // Obtener catálogo de un usuario
  app.get('/catalog/:userId', async (req, reply) => {
    const { userId } = req.params as any;
    try {
      const res = await db.execute({
        sql: 'SELECT * FROM catalog_items WHERE user_id = ? AND status = "active" ORDER BY created_at DESC',
        args: [userId]
      });
      return reply.send({ items: res.rows });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al cargar catálogo' });
    }
  });

  // Publicar un nuevo item
  app.post('/catalog', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { title, description, price, currency, type, image_url, category } = req.body as any;
    const userId = (req.user as any).id;

    if (!title) return reply.code(400).send({ error: 'El título es obligatorio' });

    try {
      const id = crypto.randomUUID();
      await db.execute({
        sql: 'INSERT INTO catalog_items (id, user_id, title, description, price, currency, type, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [id, userId, title, description || '', price || 0, currency || 'USD', type || 'product', image_url || null, category || 'General']
      });
      return reply.send({ id, message: 'Item publicado' });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al publicar item' });
    }
  });


  // Editar item
  app.put('/catalog/:id', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { id } = req.params as any;
    const { title, description, price, type, category } = req.body as any;
    const userId = (req.user as any).id;

    try {
      await db.execute({
        sql: 'UPDATE catalog_items SET title = ?, description = ?, price = ?, type = ?, category = ? WHERE id = ? AND user_id = ?',
        args: [title, description, price, type, category || 'General', id, userId]
      });
      return reply.send({ message: 'Item actualizado' });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al actualizar' });
    }
  });

  // Eliminar item
  app.delete('/catalog/:id', { preValidation: [(app as any).authenticate] }, async (req, reply) => {
    const { id } = req.params as any;
    const userId = (req.user as any).id;

    try {
      await db.execute({
        sql: 'DELETE FROM catalog_items WHERE id = ? AND user_id = ?',
        args: [id, userId]
      });
      return reply.send({ message: 'Item eliminado' });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al eliminar item' });
    }
  });
}
