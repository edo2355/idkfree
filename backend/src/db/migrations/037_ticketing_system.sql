-- 1. Venues (Estadios/Lugares)
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  organizer_id TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Secciones del Venue (Ej. VIP, General)
CREATE TABLE IF NOT EXISTS venue_sections (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price_multiplier REAL DEFAULT 1.0,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

-- 3. Filas y Asientos por Sección
CREATE TABLE IF NOT EXISTS venue_rows (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  row_label TEXT NOT NULL,
  seat_count INTEGER NOT NULL,
  FOREIGN KEY (section_id) REFERENCES venue_sections(id) ON DELETE CASCADE
);

-- 4. Eventos
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  organizer_id TEXT NOT NULL,
  venue_id TEXT NOT NULL,
  name TEXT NOT NULL,
  event_date DATETIME NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 5. Boletos (Tickets)
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  row_id TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  price REAL NOT NULL,
  status TEXT DEFAULT 'available', -- available, reserved, sold
  buyer_id TEXT,
  qr_code TEXT UNIQUE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (row_id) REFERENCES venue_rows(id)
);
