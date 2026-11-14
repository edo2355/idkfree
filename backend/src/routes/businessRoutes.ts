import type { FastifyInstance } from 'fastify';
import { createEscrowDeal, releaseEscrowFunds } from '../services/escrowService.js';
import { createProduct, getProducts } from '../services/shopService.js';
import { requireAuth } from '../middleware/auth.js';

export async function businessRoutes(app: FastifyInstance) {
  
  // --- ESCROW ---
  app.post('/escrow/create', { preHandler: [requireAuth] }, async (req, reply) => {
    const { creatorId, amount } = req.body as { creatorId: string, amount: number };
    const brandId = (req as any).userId;
    try {
      const result = await createEscrowDeal(brandId, creatorId, amount);
      return reply.code(201).send(result);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando garantía' });
    }
  });

  app.post('/escrow/release', { preHandler: [requireAuth] }, async (req, reply) => {
    const { dealId } = req.body as { dealId: string };
    try {
      const result = await releaseEscrowFunds(dealId);
      return reply.send(result);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error liberando fondos' });
    }
  });

  // --- SHOP ---
  app.post('/shop/products', { preHandler: [requireAuth] }, async (req, reply) => {
    const { title, price, stock } = req.body as { title: string, price: number, stock: number };
    const sellerId = (req as any).userId;
    try {
      const product = await createProduct(sellerId, title, price, stock);
      return reply.code(201).send(product);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando producto' });
    }
  });

  app.get('/shop/products', async (req, reply) => {
    try {
      const products = await getProducts();
      return reply.send(products);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo productos' });
    }
  });
}
