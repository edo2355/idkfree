import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function createVenue(organizerId: string, name: string, location: string) {
  const id = randomUUID();
  await query(
    `INSERT INTO venues (id, organizer_id, name, location) VALUES ($1, $2, $3, $4)`,
    [id, organizerId, name, location]
  );
  return { id, name, location };
}

export async function addSection(venueId: string, name: string, priceMultiplier: number) {
  const id = randomUUID();
  await query(
    `INSERT INTO venue_sections (id, venue_id, name, price_multiplier) VALUES ($1, $2, $3, $4)`,
    [id, venueId, name, priceMultiplier]
  );
  return { id, name, priceMultiplier };
}

export async function addRow(sectionId: string, rowLabel: string, seatCount: number) {
  const id = randomUUID();
  await query(
    `INSERT INTO venue_rows (id, section_id, row_label, seat_count) VALUES ($1, $2, $3, $4)`,
    [id, sectionId, rowLabel, seatCount]
  );
  return { id, rowLabel, seatCount };
}

export async function createEvent(organizerId: string, venueId: string, name: string, date: string) {
  const id = randomUUID();
  await query(
    `INSERT INTO events (id, organizer_id, venue_id, name, event_date) VALUES ($1, $2, $3, $4, $5)`,
    [id, organizerId, venueId, name, date]
  );
  return { id, name, date };
}
