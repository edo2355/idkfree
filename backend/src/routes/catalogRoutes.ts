import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/catalogService.js';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { randomUUID } from 'crypto';

export async function catalogRoutes(app: FastifyInstance) {
  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  app.get('/catalog/products', async (req, reply) => {
    try {
      const filters = req.query as any;
      return reply.send(await getProducts(filters));
    } catch (error) { return reply.code(500).send({ error: 'Error obteniendo productos' }); }
  });

  app.post('/catalog/upload', { preHandler: [requireAuth] }, async (req, reply) => {
    const data = await req.file();
    if (!data) return reply.code(400).send({ error: 'No file' });
    const filename = `product-${randomUUID()}.${data.filename.split('.').pop()}`;
    await pipeline(data.file, createWriteStream(join(uploadDir, filename)));
    return reply.send({ url: `/uploads/${filename}` });
  });

  app.post('/catalog/products', { preHandler: [requireAuth] }, async (req, reply) => {
    const sellerId = (req as any).userId;
    try { return reply.code(201).send(await createProduct(sellerId, req.body)); } catch (error) { return reply.code(500).send({ error: 'Error creando producto' }); }
  });

  app.put('/catalog/products/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const sellerId = (req as any).userId;
    try { return reply.send(await updateProduct(id, sellerId, req.body)); } catch (error) { return reply.code(500).send({ error: 'Error editando producto' }); }
  });

  app.delete('/catalog/products/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const sellerId = (req as any).userId;
    try { return reply.send(await deleteProduct(id, sellerId)); } catch (error) { return reply.code(500).send({ error: 'Error eliminando producto' }); }
  });
}
