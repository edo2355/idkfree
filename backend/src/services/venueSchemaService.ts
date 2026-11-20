import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export interface VenueJSON {
  name: string;
  type: string;
  country: string;
  city?: string;
  timezone?: string;
  capacity: number;
  coordinates?: { lat: number; lng: number };
  map?: { width: number; height: number; backgroundImage?: string };
  address?: string;
  shape?: string;
  sections: SectionJSON[];
}

export interface SectionJSON {
  name: string;
  layoutType: string;
  seatRankId?: string;
  price: number;
  color?: string;
  accessible?: boolean;
  curve?: { centerX: number; centerY: number; radius: number; startAngle: number; endAngle: number };
  polygon?: any;
  capacityMax?: number;
  rows: RowJSON[];
}

export interface RowJSON {
  name: string;
  index: number;
  curve?: any;
  seats: SeatJSON[];
}

export interface SeatJSON {
  number: number;
  label: string;
  x: number;
  y: number;
  seatType?: string;
}

export async function createFullVenue(organizerId: string, data: VenueJSON) {
  const venueId = data.city ? `${data.name.toLowerCase().replace(/\s+/g, '-')}-${data.country.toLowerCase()}` : randomUUID();
  
  // 1. Insertar Venue
  await query(
    `INSERT INTO venues (id, organizer_id, name, type, country, city, timezone, address, capacity, shape,
      lat, lng, map_width, map_height, background_image)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      venueId, organizerId, data.name, data.type, data.country, data.city || null,
      data.timezone || null, data.address || null, data.capacity, data.shape || 'rectangular',
      data.coordinates?.lat || null, data.coordinates?.lng || null,
      data.map?.width || 1200, data.map?.height || 900, data.map?.backgroundImage || null
    ]
  );

  // 2. Insertar Secciones, Filas y Asientos
  for (const section of data.sections) {
    const sectionId = randomUUID();
    await query(
      `INSERT INTO venue_sections (id, venue_id, name, price, color, layout_type, seat_rank_id, accessible, curve, polygon, capacity_max)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        sectionId, venueId, section.name, section.price, section.color || '#3B82F6',
        section.layoutType, section.seatRankId || 'general',
        section.accessible ? 1 : 0,
        section.curve ? JSON.stringify(section.curve) : null,
        section.polygon ? JSON.stringify(section.polygon) : null,
        section.capacityMax || null
      ]
    );

    for (const row of section.rows) {
      const rowId = randomUUID();
      await query(
        `INSERT INTO venue_rows (id, section_id, row_label, seat_count, row_index, curve)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [rowId, sectionId, row.name, row.seats.length, row.index, row.curve ? JSON.stringify(row.curve) : null]
      );

      for (const seat of row.seats) {
        await query(
          `INSERT INTO venue_seats (id, row_id, section_id, seat_number, seat_label, x, y, seat_type)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [randomUUID(), rowId, sectionId, seat.number, seat.label, seat.x, seat.y, seat.seatType || 'normal']
        );
      }
    }
  }

  return { venueId, message: 'Venue creado correctamente' };
}

export async function getFullVenue(venueId: string) {
  const venue = await query(`SELECT * FROM venues WHERE id = $1`, [venueId]);
  if (venue.rows.length === 0) throw new Error('VENUE_NOT_FOUND');
  
  const sections = await query(`SELECT * FROM venue_sections WHERE venue_id = $1`, [venueId]);
  const sectionsWithRows = [];
  
  for (const section of sections.rows) {
    const rows = await query(`SELECT * FROM venue_rows WHERE section_id = $1 ORDER BY row_index`, [section.id]);
    const rowsWithSeats = [];
    
    for (const row of rows.rows) {
      const seats = await query(`SELECT * FROM venue_seats WHERE row_id = $1 ORDER BY seat_number`, [row.id]);
      rowsWithSeats.push({ ...row, seats: seats.rows });
    }
    sectionsWithRows.push({ ...section, rows: rowsWithSeats });
  }
  
  return { ...venue.rows[0], sections: sectionsWithRows };
}

// ==========================================
// 3. Crear ticket "aplanado"
// ==========================================
export async function createFlatTicket(input: {
  eventId: string; buyerId: string; venueId: string; venueName: string;
  sectionName: string; rowName: string; seatLabel: string;
  seatType?: string; price: number; currency?: string;
}) {
  const id = randomUUID();
  const qrPayload = `TKT-${id.slice(0, 8).toUpperCase()}`;
  
  await query(
    `INSERT INTO event_tickets (id, event_id, buyer_id, venue_id, venue_name, section_name, row_name, seat_label, seat_type, price, currency, qr_payload)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [id, input.eventId, input.buyerId, input.venueId, input.venueName, input.sectionName, input.rowName, input.seatLabel,
     input.seatType || 'normal', input.price, input.currency || 'USD', qrPayload]
  );
  
  return { ticketId: id, qrPayload, ...input };
}
