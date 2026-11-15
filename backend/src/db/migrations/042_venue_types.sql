CREATE TABLE IF NOT EXISTS venue_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

INSERT OR IGNORE INTO venue_types (id, name, description) VALUES
('estadio', 'Estadio', 'Recintos deportivos al aire libre, con capacidad para miles de personas.'),
('teatro', 'Teatro', 'Lugares con escenario frontal, acústica especial y butacas numeradas.'),
('arena', 'Arena', 'Recintos cubiertos multifuncionales para conciertos y deportes indoor.'),
('anfiteatro', 'Anfiteatro', 'Estructura semicircular al aire libre, ideal para conciertos acústicos.'),
('auditorio', 'Auditorio', 'Salas cerradas con butacas fijas y enfoque en conferencias o música.'),
('coliseo', 'Coliseo', 'Grandes recintos cubiertos, similares a arenas pero con configuración circular.'),
('estadio_cubierto', 'Estadio Cubierto', 'Instalaciones deportivas techadas para eventos durante todo el año.'),
('club', 'Club / Discoteca', 'Espacios más pequeños, con pista de baile y ambiente nocturno.'),
('centro_convenciones', 'Centro de Convenciones', 'Recintos diseñados para ferias, exposiciones y eventos corporativos.'),
('plaza', 'Plaza / Aire Libre', 'Espacios abiertos urbanos o rurales para eventos masivos.');
