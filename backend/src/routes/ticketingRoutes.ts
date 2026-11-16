import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { createEvent, getEvents } from '../services/ticketingService.js';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { randomUUID } from 'crypto';

export async function ticketingRoutes(app: FastifyInstance) {
  
  // Asegurar que la carpeta uploads exista
  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  // Obtener Países
  app.get('/ticketing/countries', async (req, reply) => {
    const res = await query('SELECT code, name FROM countries ORDER BY name ASC');
    return reply.send(res.rows);
  });

  // Obtener Tipos de Recintos
  app.get('/ticketing/venue-types', async (req, reply) => {
    const res = await query('SELECT id, name FROM venue_types ORDER BY name ASC');
    return reply.send(res.rows);
  });

  // Obtener Venues (Filtrados)
  app.get('/ticketing/venues', async (req, reply) => {
    const { country, type } = req.query as { country?: string, type?: string };
    let sql = 'SELECT id, name, type, country, address, capacity FROM venues WHERE 1=1';
    const params = [];
    if (country) { sql += ' AND country = $' + (params.length + 1); params.push(country); }
    if (type) { sql += ' AND type = $' + (params.length + 1); params.push(type); }
    sql += ' ORDER BY name ASC LIMIT 50';
    const res = await query(sql, params);
    return reply.send(res.rows);
  });

  // SUBIDA DE IMAGEN DE PROMOCIÓN
  app.post('/ticketing/upload-promo', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      const data = await req.file();
      if (!data) return reply.code(400).send({ error: 'No se envió ninguna imagen' });

      const ext = data.filename.split('.').pop();
      const filename = `promo-${randomUUID()}.${ext}`;
      const filepath = join(uploadDir, filename);

      await pipeline(data.file, createWriteStream(filepath));

      // Devolvemos la URL pública (Render sirve /uploads estáticamente)
      return reply.send({ url: `/uploads/${filename}` });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error subiendo imagen' });
    }
  });

  // Crear Evento
  app.post('/ticketing/events', { preHandler: [requireAuth] }, async (req, reply) => {
    const { venueId, name, date, promoImageUrl } = req.body as { venueId: string, name: string, date: string, promoImageUrl?: string };
    const organizerId = (req as any).userId;
    try {
      const event = await createEvent(organizerId, venueId, name, date, promoImageUrl);
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
