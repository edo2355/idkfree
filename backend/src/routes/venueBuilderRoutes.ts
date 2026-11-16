import type { FastifyInstance } from 'fastify';
import { createCustomVenue, getCustomVenues } from '../services/venueBuilderService.js';
import { requireAuth } from '../middleware/auth.js';

export async function venueBuilderRoutes(app: FastifyInstance) {
  app.post('/builder/venues', { preHandler: [requireAuth] }, async (req, reply) => {
    const organizerId = (req as any).userId;
    try {
      const result = await createCustomVenue(organizerId, req.body);
      return reply.code(201).send(result);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando recinto personalizado' });
    }
  });

  app.get('/builder/venues', { preHandler: [requireAuth] }, async (req, reply) => {
    const organizerId = (req as any).userId;
    try {
      const venues = await getCustomVenues(organizerId);
      return reply.send(venues);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo recintos' });
    }
  });
}
