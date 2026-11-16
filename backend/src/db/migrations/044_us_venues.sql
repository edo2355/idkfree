-- Crear la tabla de recintos (si no existe)
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ⚽ ESTADIOS (Estadios de fútbol y capacidad masiva en EE. UU.)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Gillette Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Hard Rock Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Geodis Park', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Historic Crew Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Harvard Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Hersheypark Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Huntington Bank Field', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Michigan Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Beaver Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Ohio Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Kyle Field', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Neyland Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'Tiger Stadium', 'estadio', 'US'),
(lower(hex(randomblob(16))), 'SoFi Stadium', 'estadio', 'US');

-- 🏀 ARENAS (Pabellones cubiertos polivalentes)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Madison Square Garden', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Crypto.com Arena', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Barclays Center', 'arena', 'US'),
(lower(hex(randomblob(16))), 'United Center', 'arena', 'US'),
(lower(hex(randomblob(16))), 'TD Garden', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Chase Center', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Addition Financial Arena', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Truist Arena', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Hinkle Fieldhouse', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Dale F. Halton Arena', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Cameron Indoor Stadium', 'arena', 'US'),
(lower(hex(randomblob(16))), 'Value City Arena', 'arena', 'US');

-- 🎭 TEATROS Y SALAS DE CONCIERTO
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Michigan Theater', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Detroit Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Million Dollar Theater', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'North Park Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Oriental Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Orpheum Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Palace Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Apollo Theater', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Chicago Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Coronado Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Rosemont Theatre', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Paramount Theatre', 'teatro', 'US');

-- 🎸 ANFITEATROS (Al aire libre)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Red Rocks Amphitheatre', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'The Gorge Amphitheatre', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'Hollywood Bowl', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'Ascend Amphitheater', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'PNC Bank Arts Center', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'Gerald R. Ford Amphitheater', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'The Wharf Amphitheater', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'Northwell Health at Jones Beach Theater', 'anfiteatro', 'US'),
(lower(hex(randomblob(16))), 'Saratoga Performing Arts Center', 'anfiteatro', 'US');

-- 🎻 AUDITORIOS
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Auditorium Theatre', 'auditorio', 'US'),
(lower(hex(randomblob(16))), 'Kleinhans Music Hall', 'auditorio', 'US'),
(lower(hex(randomblob(16))), 'Neal S. Blaisdell Center Concert Hall', 'auditorio', 'US'),
(lower(hex(randomblob(16))), 'Thomas Wolfe Auditorium', 'auditorio', 'US'),
(lower(hex(randomblob(16))), 'John R. Emens Auditorium', 'auditorio', 'US'),
(lower(hex(randomblob(16))), 'Hochstein Performance Hall', 'auditorio', 'US');

-- 🏟️ COLISEOS (Recintos cubiertos de gran capacidad)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Mississippi Coast Coliseum', 'coliseo', 'US'),
(lower(hex(randomblob(16))), 'Arizona Veterans Memorial Coliseum', 'coliseo', 'US'),
(lower(hex(randomblob(16))), 'Bojangles Coliseum', 'coliseo', 'US'),
(lower(hex(randomblob(16))), 'Richmond Coliseum', 'coliseo', 'US'),
(lower(hex(randomblob(16))), 'Cumberland County Crown Coliseum', 'coliseo', 'US'),
(lower(hex(randomblob(16))), 'El Paso County Coliseum', 'coliseo', 'US'),
(lower(hex(randomblob(16))), 'Fair Park Coliseum', 'coliseo', 'US');
