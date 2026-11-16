import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function createCustomVenue(organizerId: string, data: any) {
  const venueId = randomUUID();
  
  // 1. Crear el recinto principal
  await query(
    `INSERT INTO venues (id, organizer_id, name, type, country, address, capacity, shape) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [venueId, organizerId, data.name, data.type, data.country, data.address, data.capacity, data.shape]
  );

  // 2. Guardar secciones y filas
  for (const section of data.sections) {
    const sectionId = randomUUID();
    await query(
      `INSERT INTO venue_sections (id, venue_id, name, price, color) VALUES ($1, $2, $3, $4, $5)`,
      [sectionId, venueId, section.name, section.price, section.color]
    );

    for (const row of section.rows) {
      await query(
        `INSERT INTO venue_rows (id, section_id, row_label, seat_count) VALUES ($1, $2, $3, $4)`,
        [randomUUID(), sectionId, row.label, row.seats]
      );
    }
  }

  return { id: venueId, message: 'Recinto personalizado creado' };
}

export async function getCustomVenues(organizerId: string) {
  const res = await query(`SELECT * FROM venues WHERE organizer_id = $1 ORDER BY created_at DESC`, [organizerId]);
  return res.rows;
}
