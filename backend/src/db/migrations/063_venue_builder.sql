-- Tabla para las secciones de un recinto (VIP, General, etc.)
CREATE TABLE IF NOT EXISTS venue_sections (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  color TEXT DEFAULT '#3B82F6', -- Color por defecto (Azul)
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

-- Tabla para las filas de cada sección
CREATE TABLE IF NOT EXISTS venue_rows (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  row_label TEXT NOT NULL,
  seat_count INTEGER NOT NULL,
  FOREIGN KEY (section_id) REFERENCES venue_sections(id) ON DELETE CASCADE
);
