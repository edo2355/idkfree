import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { createEvent, getEvents, createVenue } from '../services/ticketingService.js';
import { requireAuth } from '../middleware/auth.js';

export async function ticketingRoutes(app: FastifyInstance) {
  
  // --- RUTAS PÚBLICAS DE CATÁLOGO ---
  
  // Obtener todos los países
  app.get('/ticketing/countries', async (req, reply) => {
    try {
      const res = await query('SELECT code, name FROM countries ORDER BY name ASC');
      return reply.send(res.rows);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo países' });
    }
  });

  // Obtener todos los tipos de recintos
  app.get('/ticketing/venue-types', async (req, reply) => {
    try {
      const res = await query('SELECT id, name FROM venue_types ORDER BY name ASC');
      return reply.send(res.rows);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo tipos de recintos' });
    }
  });

  // --- RUTAS PROTEGIDAS DE EVENTOS ---

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
