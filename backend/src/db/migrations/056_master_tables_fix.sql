-- ==========================================
-- 1. ASEGURAR COLUMNAS FALTANTES EN TABLAS EXISTENTES
-- (Usamos un bloque de control para no fallar si ya existen)
-- ==========================================

-- Intentamos agregar las columnas. Si ya existen, el migrate.js fallará, 
-- así que borraremos las líneas si ya las tienes, pero como las migraciones se detuvieron, es probable que no existan.
ALTER TABLE venues ADD COLUMN address TEXT;
ALTER TABLE venues ADD COLUMN capacity INTEGER;
ALTER TABLE venues ADD COLUMN shape TEXT DEFAULT 'rectangular';
ALTER TABLE events ADD COLUMN promo_image_url TEXT;
ALTER TABLE users ADD COLUMN telegram_chat_id TEXT;
ALTER TABLE waitlist ADD COLUMN telegram_chat_id TEXT;

-- ==========================================
-- 2. CREAR NUEVAS TABLAS PARA LA TICKETERA
-- ==========================================

-- Métodos de pago aceptados por evento
CREATE TABLE IF NOT EXISTS event_payment_methods (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  method TEXT NOT NULL, -- 'qvapay', 'cash', 'enzona'
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Staff autorizado para vender en un evento
CREATE TABLE IF NOT EXISTS event_staff (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'seller', -- 'seller', 'manager'
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Asientos específicos por evento (para el mapa interactivo real)
CREATE TABLE IF NOT EXISTS event_seats (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  section_name TEXT NOT NULL,
  row_label TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  status TEXT DEFAULT 'available', -- 'available', 'sold', 'broken', 'reserved'
  buyer_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. RECARGAR DATOS FALTANTES (POR SI ACASO)
-- ==========================================
-- Recargamos los países por si la migración 055 falló
INSERT OR IGNORE INTO countries (code, name) VALUES
('PR', 'Puerto Rico'), ('GU', 'Guam'), ('VI', 'Islas Vírgenes de los Estados Unidos'),
('AS', 'Samoa Americana'), ('MP', 'Islas Marianas del Norte'), ('XK', 'Kosovo'),
('TW', 'Taiwán'), ('EH', 'Sahara Occidental'), ('VA', 'Ciudad del Vaticano'),
('PS', 'Palestina'), ('BL', 'San Bartolomé'), ('MF', 'San Martín (Francia)'),
('SX', 'Sint Maarten (Países Bajos)'), ('BQ', 'Caribe Neerlandés'),
('TC', 'Islas Turcas y Caicos'), ('KY', 'Islas Caimán'), ('BM', 'Bermudas'),
('GL', 'Groenlandia'), ('FO', 'Islas Feroe'), ('AX', 'Islas Åland'),
('NC', 'Nueva Caledonia'), ('PF', 'Polinesia Francesa'), ('WF', 'Wallis y Futuna'),
('TK', 'Tokelau'), ('NU', 'Niue'), ('CK', 'Islas Cook');
