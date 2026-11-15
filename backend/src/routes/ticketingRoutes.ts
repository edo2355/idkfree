import type { FastifyInstance } from 'fastify';
import { createEvent, getEvents, createVenue } from '../services/ticketingService.js';
import { requireAuth } from '../middleware/auth.js';

export async function ticketingRoutes(app: FastifyInstance) {
  // Listar eventos del organizador
  app.get('/ticketing/events', { preHandler: [requireAuth] }, async (req, reply) => {
    const organizerId = (req as any).userId;
    try {
      const events = await getEvents(organizerId);
      return reply.send(events);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo eventos' });
    }
  });

  // Crear un evento
  app.post('/ticketing/events', { preHandler: [requireAuth] }, async (req, reply) => {
    const { venueId, name, date } = req.body as { venueId: string, name: string, date: string };
    const organizerId = (req as any).userId;
    try {
      const event = await createEvent(organizerId, venueId, name, date);
      return reply.code(201).send(event);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando evento' });
    }
  });

  // Crear un venue (por si se necesita en el futuro)
  app.post('/ticketing/venues', { preHandler: [requireAuth] }, async (req, reply) => {
    const { name, location } = req.body as { name: string, location: string };
    const organizerId = (req as any).userId;
    try {
      const venue = await createVenue(organizerId, name, location);
      return reply.code(201).send(venue);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando venue' });
    }
  });
}
