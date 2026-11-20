import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { createFullVenue, getFullVenue, createFlatTicket } from '../services/venueSchemaService.js';

export async function venueSchemaRoutes(app: FastifyInstance) {
  
  // Listar los recintos del organizador
  app.get('/venues/mine', { preHandler: [requireAuth] }, async (req, reply) => {
    const organizerId = (req as any).userId;
    try {
      const res = await query(
        `SELECT id, name, type, country, city, address, capacity, shape FROM venues WHERE organizer_id = $1 ORDER BY name ASC`,
        [organizerId]
      );
      return reply.send(res.rows);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error obteniendo mis recintos' });
    }
  });

  // Obtener un recinto completo
  app.get('/venues/:id/full', async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      return reply.send(await getFullVenue(id));
    } catch (error: any) {
      if (error.message === 'VENUE_NOT_FOUND') return reply.code(404).send({ error: 'Venue no encontrado' });
      return reply.code(500).send({ error: 'Error obteniendo venue' });
    }
  });

  // Crear un venue completo
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

  // Actualizar un venue completo (se eliminó la validación estricta para permitir editar globales)
  app.put('/venues/:id/full', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const data = req.body as any;
    try {
      // 1. Actualizar metadatos del venue
      await query(
        `UPDATE venues SET name = $1, type = $2, country = $3, city = $4, address = $5, capacity = $6, shape = $7 WHERE id = $8`,
        [data.name, data.type, data.country, data.city, data.address, data.capacity, data.shape, id]
      );

      // 2. Eliminar secciones y filas antiguas (asientos se eliminan en cascada)
      await query(`DELETE FROM venue_sections WHERE venue_id = $1`, [id]);

      // 3. Recrear secciones, filas y asientos
      const { randomUUID } = await import('crypto');
      for (const section of data.sections) {
        const sectionId = randomUUID();
        await query(
          `INSERT INTO venue_sections (id, venue_id, name, price, color, layout_type, seat_rank_id, accessible, curve)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [sectionId, id, section.name, section.price, section.color || '#3B82F6', section.layoutType || 'straight',
           section.seatRankId || 'general', section.accessible ? 1 : 0,
           section.curve ? JSON.stringify(section.curve) : null]
        );

        for (const row of section.rows) {
          const rowId = randomUUID();
          await query(
            `INSERT INTO venue_rows (id, section_id, row_label, seat_count, row_index, curve) VALUES ($1,$2,$3,$4,$5,$6)`,
            [rowId, sectionId, row.name, row.seats.length, row.index, row.curve ? JSON.stringify(row.curve) : null]
          );
          for (const seat of row.seats) {
            await query(
              `INSERT INTO venue_seats (id, row_id, section_id, seat_number, seat_label, x, y, seat_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
              [randomUUID(), rowId, sectionId, seat.number, seat.label, seat.x, seat.y, seat.seatType || 'normal']
            );
          }
        }
      }

      return reply.send({ success: true, venueId: id });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error actualizando venue' });
    }
  });

  app.post('/tickets', { preHandler: [requireAuth] }, async (req, reply) => {
    const buyerId = (req as any).userId;
    try {
      const ticket = await createFlatTicket({ ...(req.body as any), buyerId });
      return reply.code(201).send(ticket);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error emitiendo ticket' });
    }
  });
}
