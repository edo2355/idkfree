import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function createEvent(organizerId: string, venueId: string, name: string, date: string) {
  const id = randomUUID();
  await query(
    `INSERT INTO events (id, organizer_id, venue_id, name, event_date) VALUES ($1, $2, $3, $4, $5)`,
    [id, organizerId, venueId, name, date]
  );
  return { id, name, date };
}

export async function getEvents(organizerId: string) {
  const res = await query(`SELECT * FROM events WHERE organizer_id = $1 ORDER BY created_at DESC`, [organizerId]);
  return res.rows;
}

// Las funciones de venues y secciones se mantienen
export async function createVenue(organizerId: string, name: string, location: string) {
  const id = randomUUID();
  await query(`INSERT INTO venues (id, organizer_id, name, location) VALUES ($1, $2, $3, $4)`, [id, organizerId, name, location]);
  return { id, name, location };
}
