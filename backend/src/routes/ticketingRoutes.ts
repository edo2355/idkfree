import type { FastifyInstance } from 'fastify';
import { createVenue, addSection, addRow, createEvent } from '../services/ticketingService.js';
import { requireAuth } from '../middleware/auth.js';

export async function ticketingRoutes(app: FastifyInstance) {
  // Crear un Venue/Estadio
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

  // Crear una sección (VIP, General)
  app.post('/ticketing/sections', { preHandler: [requireAuth] }, async (req, reply) => {
    const { venueId, name, priceMultiplier } = req.body as { venueId: string, name: string, priceMultiplier: number };
    try {
      const section = await addSection(venueId, name, priceMultiplier);
      return reply.code(201).send(section);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando sección' });
    }
  });

  // Crear una fila con asientos
  app.post('/ticketing/rows', { preHandler: [requireAuth] }, async (req, reply) => {
    const { sectionId, rowLabel, seatCount } = req.body as { sectionId: string, rowLabel: string, seatCount: number };
    try {
      const row = await addRow(sectionId, rowLabel, seatCount);
      return reply.code(201).send(row);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error creando fila' });
    }
  });

  // Crear un Evento
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
}
