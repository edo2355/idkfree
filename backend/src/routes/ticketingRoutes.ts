import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { createEvent, getEvents, updateEvent, deleteEvent } from '../services/ticketingService.js';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { randomUUID } from 'crypto';

export async function ticketingRoutes(app: FastifyInstance) {
  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  app.get('/ticketing/countries', async (req, reply) => {
    const res = await query('SELECT code, name FROM countries ORDER BY name ASC');
    return reply.send(res.rows);
  });

  app.get('/ticketing/venue-types', async (req, reply) => {
    const res = await query('SELECT id, name FROM venue_types ORDER BY name ASC');
    return reply.send(res.rows);
  });

  app.get('/ticketing/venues', async (req, reply) => {
    const { country, type } = req.query as { country?: string, type?: string };
    let sql = 'SELECT id, name, type, country, address, capacity, shape FROM venues WHERE 1=1';
    const params = [];
    if (country) { sql += ' AND country = $' + (params.length + 1); params.push(country); }
    if (type) { sql += ' AND type = $' + (params.length + 1); params.push(type); }
    sql += ' ORDER BY name ASC LIMIT 100';
    const res = await query(sql, params);
    return reply.send(res.rows);
  });

  app.post('/ticketing/upload-promo', { preHandler: [requireAuth] }, async (req, reply) => {
    const data = await req.file();
    if (!data) return reply.code(400).send({ error: 'No file' });
    const ext = data.filename.split('.').pop();
    const filename = `promo-${randomUUID()}.${ext}`;
    await pipeline(data.file, createWriteStream(join(uploadDir, filename)));
    return reply.send({ url: `/uploads/${filename}` });
  });

  app.post('/ticketing/events', { preHandler: [requireAuth] }, async (req, reply) => {
    const { venueId, name, date, promoImageUrl, textTheme, category, paymentMethods } = req.body as any;
    const organizerId = (req as any).userId;
    try {
      const event = await createEvent(organizerId, venueId, name, date, promoImageUrl, textTheme, category, paymentMethods);
      return reply.code(201).send(event);
    } catch (error) { return reply.code(500).send({ error: 'Error creando evento' }); }
  });

  app.get('/ticketing/events', { preHandler: [requireAuth] }, async (req, reply) => {
    const organizerId = (req as any).userId;
    try { return reply.send(await getEvents(organizerId)); } catch (error) { return reply.code(500).send({ error: 'Error obteniendo eventos' }); }
  });

  // EDITAR EVENTO
  app.put('/ticketing/events/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { name, date, category, textTheme } = req.body as any;
    try { return reply.send(await updateEvent(id, name, date, category, textTheme)); } catch (error) { return reply.code(500).send({ error: 'Error editando' }); }
  });

  // ELIMINAR EVENTO
  app.delete('/ticketing/events/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try { return reply.send(await deleteEvent(id)); } catch (error) { return reply.code(500).send({ error: 'Error eliminando' }); }
  });
}
