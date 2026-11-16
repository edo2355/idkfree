-- Añadir la columna shape (forma geométrica) a la tabla de recintos
ALTER TABLE venues ADD COLUMN shape TEXT DEFAULT 'rectangular';

-- Actualizar SOLO las arenas de EE.UU. con forma 'circular'
UPDATE venues SET shape = 'circular' WHERE type = 'arena' AND country = 'US';
