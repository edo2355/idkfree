-- ==========================================
-- 1. ARREGLAR SHAPES NULOS EN CUBA Y EL MUNDO
-- ==========================================
UPDATE venues SET shape = 'rectangular' WHERE shape IS NULL AND type IN ('teatro', 'estadio', 'sala de conciertos', 'centro cultural');
UPDATE venues SET shape = 'circular' WHERE shape IS NULL AND type IN ('coliseo', 'arena');

-- Asignar formas específicas a los recintos cubanos icónicos
UPDATE venues SET shape = 'herradura' WHERE name = 'Gran Teatro de La Habana Alicia Alonso';
UPDATE venues SET shape = 'rectangular' WHERE name = 'Teatro Karl Marx';
UPDATE venues SET shape = 'circular' WHERE name = 'Coliseo de la Ciudad Deportiva';
UPDATE venues SET shape = 'rectangular' WHERE name = 'Fábrica de Arte Cubano (FAC)';

-- ==========================================
-- 2. INSERTAR RECINTOS CON ESTRUCTURAS COMPLEJAS (Mundiales)
-- ==========================================

-- THE SPHERE (Las Vegas)
INSERT OR IGNORE INTO venues (id, name, type, country, address, capacity, shape) VALUES
(lower(hex(randomblob(16))), 'The Sphere', 'arena', 'US', '255 Sands Ave, Las Vegas, NV 89169, USA', 17600, 'sphere');

-- NIDO DEL PÁJARO (Beijing)
INSERT OR IGNORE INTO venues (id, name, type, country, address, capacity, shape) VALUES
(lower(hex(randomblob(16))), 'Beijing National Stadium (Bird''s Nest)', 'estadio', 'CN', '1 National Stadium S Rd, Chaoyang, Beijing, China', 91000, 'bird_nest');

-- LA BOMBONERA (Argentina)
INSERT OR IGNORE INTO venues (id, name, type, country, address, capacity, shape) VALUES
(lower(hex(randomblob(16))), 'Estadio Alberto J. Armando (La Bombonera)', 'estadio', 'AR', 'Brandsen 805, C1161 CABA, Argentina', 54000, 'd_shape');

-- TEATRO REAL (Madrid)
INSERT OR IGNORE INTO venues (id, name, type, country, address, capacity, shape) VALUES
(lower(hex(randomblob(16))), 'Teatro Real', 'teatro', 'ES', 'Pl. de Isabel II, s/n, 28013 Madrid, España', 1746, 'hexagonal');

-- ESTADIO AZTECA (México)
INSERT OR IGNORE INTO venues (id, name, type, country, address, capacity, shape) VALUES
(lower(hex(randomblob(16))), 'Estadio Azteca', 'estadio', 'MX', 'Calz. de Tlalpan 3465, Sta. Úrsula Coapa, Coyoacán, CDMX, México', 87000, 'superelipse');

-- MADISON SQUARE GARDEN (Nueva York)
UPDATE venues SET shape = 'circular' WHERE name = 'Madison Square Garden';
