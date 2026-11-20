import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import { createFullVenue, getFullVenue, createFlatTicket } from '../services/venueSchemaService.js';

export async function venueSchemaRoutes(app: FastifyInstance) {
  
  // Crear venue completo con secciones, filas y asientos
  app.post('/venues/full', { preHandler: [requireAuth] }, async (req, reply) => {
    const organizerId = (req as any).userId;
    try {
      const result = await createFullVenue(organizerId, req.body as any);
      return reply.code(201).send(result);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando venue completo' });
    }
  });

  // Obtener venue con su estructura completa
  app.get('/venues/:id/full', async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      return reply.send(await getFullVenue(id));
    } catch (error: any) {
      if (error.message === 'VENUE_NOT_FOUND') return reply.code(404).send({ error: 'Venue no encontrado' });
      return reply.code(500).send({ error: 'Error obteniendo venue' });
    }
  });

  // Emitir ticket aplanado (endpoint interno para el flujo de compra)
  app.post('/tickets', { preHandler: [requireAuth] }, async (req, reply) => {
    const buyerId = (req as any).userId;
    const body = req.body as any;
    try {
      const ticket = await createFlatTicket({ ...body, buyerId });
      return reply.code(201).send(ticket);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error emitiendo ticket' });
    }
  });
}
