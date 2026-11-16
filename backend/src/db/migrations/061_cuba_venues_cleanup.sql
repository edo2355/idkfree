-- ==========================================
-- 1. ELIMINAR DUPLICADOS (Conservando el primero)
-- ==========================================
DELETE FROM venues 
WHERE rowid NOT IN (
    SELECT MIN(rowid) 
    FROM venues 
    GROUP BY name, type, country
);

-- ==========================================
-- 2. ASIGNAR FORMAS POR DEFECTO A LOS NULOS
-- ==========================================
UPDATE venues SET shape = 'rectangular' WHERE shape IS NULL AND type IN ('teatro', 'estadio', 'sala de conciertos', 'centro cultural');
UPDATE venues SET shape = 'circular' WHERE shape IS NULL AND type IN ('coliseo', 'arena');

-- ==========================================
-- 3. ACTUALIZAR FORMAS ESPECÍFICAS DE CUBA
-- ==========================================
UPDATE venues SET shape = 'herradura' WHERE name = 'Gran Teatro de La Habana Alicia Alonso';
UPDATE venues SET shape = 'rectangular' WHERE name = 'Teatro Karl Marx';
UPDATE venues SET shape = 'circular' WHERE name = 'Coliseo de la Ciudad Deportiva';
UPDATE venues SET shape = 'rectangular' WHERE name = 'Fábrica de Arte Cubano (FAC)';

-- ==========================================
-- 4. ACTUALIZAR DIRECCIONES Y CAPACIDADES FALTANTES
-- ==========================================

-- Teatros de La Habana
UPDATE venues SET address = 'Calle Línea 657, Vedado, La Habana, Cuba', capacity = 150 WHERE name = 'Sala Adolfo Llauradó';
UPDATE venues SET address = 'Calle 10 # 3409, Miramar, La Habana, Cuba', capacity = 100 WHERE name = 'Sala Argos Teatro';
UPDATE venues SET address = 'Calle 11, Vedado, La Habana, Cuba', capacity = 200 WHERE name = 'Sala Covarrubias';
UPDATE venues SET address = 'Calle 3ra, Vedado, La Habana, Cuba', capacity = 250 WHERE name = 'Sala Ernesto Lecuona';
UPDATE venues SET address = 'Calle 23, Vedado, La Habana, Cuba', capacity = 300 WHERE name = 'Sala Teatro Palace';
UPDATE venues SET address = 'Calle 10, Playa, La Habana, Cuba', capacity = 120 WHERE name = 'Teatro Aldaba';
UPDATE venues SET address = 'Calzada de G, Vedado, La Habana, Cuba', capacity = 900 WHERE name = 'Teatro Amadeo Roldán';
UPDATE venues SET address = 'Calle 10, Vedado, La Habana, Cuba', capacity = 80 WHERE name = 'Teatro El Ciervo Encantado';
UPDATE venues SET address = 'Calle 11, Vedado, La Habana, Cuba', capacity = 150 WHERE name = 'Teatro La Proa';
UPDATE venues SET address = 'Calle 39, Plaza de la Revolución, La Habana, Cuba', capacity = 3000 WHERE name = 'Teatro Nacional de Cuba';
UPDATE venues SET address = 'Calle 23, Vedado, La Habana, Cuba', capacity = 200 WHERE name = 'Teatro Nacional de Guiñol';
UPDATE venues SET address = 'Calle 10, Vedado, La Habana, Cuba', capacity = 100 WHERE name = 'Teatro de Muñecos Okantomí';
UPDATE venues SET address = 'Calle 10, Vedado, La Habana, Cuba', capacity = 200 WHERE name = 'Teatro de la Villa';
UPDATE venues SET address = 'Calle 10, Vedado, La Habana, Cuba', capacity = 150 WHERE name = 'Teatro de las Estaciones';
UPDATE venues SET address = 'Calle 10, Vedado, La Habana, Cuba', capacity = 100 WHERE name = 'El Arca Teatro - Museo de Títeres';

-- Teatros de Santiago de Cuba
UPDATE venues SET address = 'Calle 10, Santiago de Cuba, Cuba', capacity = 150 WHERE name = 'Sala Guiñol Santiago';
UPDATE venues SET address = 'Calle 10, Santiago de Cuba, Cuba', capacity = 300 WHERE name = 'Teatro Cabildo Teatral Santiago';
UPDATE venues SET address = 'Calle 10, Santiago de Cuba, Cuba', capacity = 100 WHERE name = 'Teatro Café Macubá';

-- Centros Culturales y Salas de Conciertos
UPDATE venues SET address = 'Calle 26, Nuevo Vedado, La Habana, Cuba', capacity = 800 WHERE name = 'Fábrica de Arte Cubano (FAC)';
UPDATE venues SET address = 'Calle 2, Vedado, La Habana, Cuba', capacity = 400 WHERE name = 'Sala Santiago Feliú (FAC)';
UPDATE venues SET address = 'Calle 10, Miramar, La Habana, Cuba', capacity = 300 WHERE name = 'Nave 3 (FAC)';
UPDATE venues SET address = 'Calle 26, Nuevo Vedado, La Habana, Cuba', capacity = 500 WHERE name = 'Nave 4 (FAC)';
UPDATE venues SET address = 'Calle 23, Vedado, La Habana, Cuba', capacity = 350 WHERE name = 'El Gato Tuerto';
UPDATE venues SET address = 'Avenida 47, Reparto Kohly, La Habana, Cuba', capacity = 600 WHERE name = 'Casa de la Música de Centro Habana';
UPDATE venues SET address = 'Calle 31, Vedado, La Habana, Cuba', capacity = 450 WHERE name = 'Café Cantante Mi Habana';
UPDATE venues SET address = 'Marta Abreu, Santa Clara, Cuba', capacity = 300 WHERE name = 'El Mejunje (Santa Clara)';
UPDATE venues SET address = 'Calle 25, Vedado, La Habana, Cuba', capacity = 200 WHERE name = 'El Proyecto';
