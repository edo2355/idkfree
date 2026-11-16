import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function createEvent(organizerId: string, venueId: string, name: string, date: string, promoImageUrl?: string, textTheme?: string, category?: string, paymentMethods?: string[]) {
  const id = randomUUID();
  await query(
    `INSERT INTO events (id, organizer_id, venue_id, name, event_date, promo_image_url, text_theme, category, payment_methods) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, organizerId, venueId, name, date, promoImageUrl || null, textTheme || 'light', category || 'general', JSON.stringify(paymentMethods || ['qvapay'])]
  );
  return { id, name, date };
}

// Obtenemos el alias del organizador haciendo JOIN con la tabla users
export async function getEvents(organizerId: string) {
  const res = await query(`
    SELECT 
      e.id, e.name, e.event_date, e.promo_image_url, e.venue_id, e.text_theme, e.category, e.payment_methods,
      v.name as venue_name, v.address as venue_address, v.capacity as venue_capacity, v.shape as venue_shape,
      u.alias as organizer_alias
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    LEFT JOIN users u ON e.organizer_id = u.id
    WHERE e.organizer_id = $1 
    ORDER BY e.created_at DESC
  `, [organizerId]);
  return res.rows;
}

export async function updateEvent(eventId: string, name: string, date: string, category: string, textTheme: string) {
  await query(
    `UPDATE events SET name = $1, event_date = $2, category = $3, text_theme = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5`,
    [name, date, category, textTheme, eventId]
  );
  return { success: true };
}

export async function deleteEvent(eventId: string) {
  await query(`DELETE FROM events WHERE id = $1`, [eventId]);
  return { success: true };
}
