-- Añadir columnas de mapa a venues
ALTER TABLE venues ADD COLUMN city TEXT;
ALTER TABLE venues ADD COLUMN timezone TEXT;
ALTER TABLE venues ADD COLUMN lat REAL;
ALTER TABLE venues ADD COLUMN lng REAL;
ALTER TABLE venues ADD COLUMN map_width INTEGER DEFAULT 1200;
ALTER TABLE venues ADD COLUMN map_height INTEGER DEFAULT 900;
ALTER TABLE venues ADD COLUMN background_image TEXT;

-- Ampliar venue_sections con layoutType, curve, polygon, etc.
ALTER TABLE venue_sections ADD COLUMN layout_type TEXT DEFAULT 'straight';
ALTER TABLE venue_sections ADD COLUMN seat_rank_id TEXT DEFAULT 'general';
ALTER TABLE venue_sections ADD COLUMN accessible INTEGER DEFAULT 0;
ALTER TABLE venue_sections ADD COLUMN curve TEXT;
ALTER TABLE venue_sections ADD COLUMN polygon TEXT;
ALTER TABLE venue_sections ADD COLUMN capacity_max INTEGER;

-- Ampliar venue_rows con índice y curva
ALTER TABLE venue_rows ADD COLUMN row_index INTEGER DEFAULT 0;
ALTER TABLE venue_rows ADD COLUMN curve TEXT;

-- Nueva tabla de asientos individuales
CREATE TABLE IF NOT EXISTS venue_seats (
  id TEXT PRIMARY KEY,
  row_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  seat_label TEXT NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  seat_type TEXT DEFAULT 'normal',
  FOREIGN KEY (row_id) REFERENCES venue_rows(id) ON DELETE CASCADE,
  FOREIGN KEY (section_id) REFERENCES venue_sections(id) ON DELETE CASCADE
);

-- Nueva tabla de tickets "aplanados" (sin árbol de asientos)
CREATE TABLE IF NOT EXISTS event_tickets (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  buyer_id TEXT NOT NULL,
  venue_id TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  row_name TEXT NOT NULL,
  seat_label TEXT NOT NULL,
  seat_type TEXT DEFAULT 'normal',
  price REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  qr_payload TEXT NOT NULL,
  scanned_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
