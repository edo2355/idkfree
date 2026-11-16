import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function createEvent(organizerId: string, venueId: string, name: string, date: string, promoImageUrl?: string) {
  const id = randomUUID();
  await query(
    `INSERT INTO events (id, organizer_id, venue_id, name, event_date, promo_image_url) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, organizerId, venueId, name, date, promoImageUrl || null]
  );
  return { id, name, date, promoImageUrl };
}

// AQUÍ ESTÁ LA MAGIA: Hacemos un JOIN para traer los datos del recinto
export async function getEvents(organizerId: string) {
  const res = await query(`
    SELECT 
      e.id, e.name, e.event_date, e.promo_image_url, e.venue_id,
      v.name as venue_name, v.address as venue_address, v.capacity as venue_capacity, v.shape as venue_shape
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.organizer_id = $1 
    ORDER BY e.created_at DESC
  `, [organizerId]);
  return res.rows;
}
