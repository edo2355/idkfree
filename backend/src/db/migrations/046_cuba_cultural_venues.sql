-- ==========================================
-- RECINTOS CULTURALES Y ALTERNATIVOS DE CUBA
-- ==========================================

-- 🎭 TEATROS Y SALAS DE TEATRO (LA HABANA Y PROVINCIAS)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Gran Teatro de La Habana Alicia Alonso', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Nacional de Cuba', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Martí', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Karl Marx', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Mella', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro América', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro La Proa', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Aldaba', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Sala Teatro Palace', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Sala Adolfo Llauradó', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Sala Argos Teatro', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Sala Covarrubias', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Sala Ernesto Lecuona', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'El Arca Teatro - Museo de Títeres', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro de Muñecos Okantomí', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Nacional de Guiñol', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro de la Villa', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Café Macubá', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Cabildo Teatral Santiago', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Sala Guiñol Santiago', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro de las Estaciones', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro El Ciervo Encantado', 'teatro', 'CU');

-- 🎨 CENTROS CULTURALES Y ESPACIOS ALTERNATIVOS
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Fábrica de Arte Cubano (FAC)', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'El Mejunje (Santa Clara)', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'El Proyecto', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'Cemí', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'La Manigua', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'Centro Cultural Cinematográfico ICAIC Fresa y Chocolate', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'Centro Cultural Enguayabera', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'Centro Cultural Teatro Bertolt Brecht', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'Café Literario La Comarca', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'Casa Gaia', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'La Casona de Línea', 'centro cultural', 'CU'),
(lower(hex(randomblob(16))), 'Casa del Joven Creador', 'centro cultural', 'CU');

-- 🎸 SALAS DE CONCIERTOS Y MÚSICA EN VIVO
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Sala Santiago Feliú (FAC)', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Nave 3 (FAC)', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Nave 4 (FAC)', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Salón 1930 Compay Segundo (Hotel Nacional)', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'El Gato Tuerto', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Casa de la Música de Centro Habana', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Café Cantante Mi Habana', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Salón del Jazz (El Vedado)', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Submarino Amarillo', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Oratorio de San Felipe Neri', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Sala de Concierto Ignacio Cervantes', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Salón Rosado de la Tropical', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Palacio de la Rumba', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'La Banqueta (Centro Experimental de las Artes Visuales)', 'sala de conciertos', 'CU'),
(lower(hex(randomblob(16))), 'Dos Gardenias (Miramar)', 'sala de conciertos', 'CU');
