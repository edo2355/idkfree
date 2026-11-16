import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { createEvent, getEvents } from '../services/ticketingService.js';

export async function ticketingRoutes(app: FastifyInstance) {
  
  // Obtener Países
  app.get('/ticketing/countries', async (req, reply) => {
    try {
      const res = await query('SELECT code, name FROM countries ORDER BY name ASC');
      return reply.send(res.rows);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo países' });
    }
  });

  // Obtener Tipos de Recintos
  app.get('/ticketing/venue-types', async (req, reply) => {
    try {
      const res = await query('SELECT id, name FROM venue_types ORDER BY name ASC');
      return reply.send(res.rows);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo tipos' });
    }
  });

  // Obtener Venues filtrados por país y tipo
  app.get('/ticketing/venues', async (req, reply) => {
    const { country, type } = req.query as { country?: string, type?: string };
    try {
      let sql = 'SELECT id, name, type, country, address, capacity FROM venues WHERE 1=1';
      const params = [];
      
      if (country) {
        sql += ' AND country = $' + (params.length + 1);
        params.push(country);
      }
      if (type) {
        sql += ' AND type = $' + (params.length + 1);
        params.push(type);
      }
      
      sql += ' ORDER BY name ASC LIMIT 50'; // Límite para no colapsar el frontend
      
      const res = await query(sql, params);
      return reply.send(res.rows);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo venues' });
    }
  });

  // Crear Evento
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

  // Obtener Eventos
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
}
