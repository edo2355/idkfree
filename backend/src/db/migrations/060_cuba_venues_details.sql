-- ==========================================
-- ACTUALIZAR DIRECCIONES, CAPACIDADES Y FORMAS DE CUBA
-- ==========================================

-- 🏟️ ESTADIOS
UPDATE venues SET address = 'Calle Pedro Marrero, Cerro, La Habana, Cuba', capacity = 55000, shape = 'rectangular' WHERE name = 'Estadio Latinoamericano';
UPDATE venues SET address = 'Avenida de Rancho Boyeros, La Habana, Cuba', capacity = 28000, shape = 'rectangular' WHERE name = 'Estadio Pedro Marrero';
UPDATE venues SET address = 'Avenida 26 y 51, Nuevo Vedado, La Habana, Cuba', capacity = 20000, shape = 'rectangular' WHERE name = 'Estadio Antonio Maceo';

-- 🏟️ COLISEOS Y ARENAS
UPDATE venues SET address = 'Avenida México y Vía Blanca, La Habana, Cuba', capacity = 15000, shape = 'circular' WHERE name = 'Coliseo de la Ciudad Deportiva';

-- 🎭 TEATROS Y SALAS DE CONCIERTO
UPDATE venues SET address = 'Calle 1ra y 10, Miramar, La Habana, Cuba', capacity = 5500, shape = 'rectangular' WHERE name = 'Teatro Karl Marx';
UPDATE venues SET address = 'Paseo de Martí, La Habana, Cuba', capacity = 2000, shape = 'herradura' WHERE name = 'Gran Teatro de La Habana Alicia Alonso';
UPDATE venues SET address = 'Calle Línea y A, Vedado, La Habana, Cuba', capacity = 2500, shape = 'rectangular' WHERE name = 'Teatro Mella';
UPDATE venues SET address = 'Heredia y Clarín, Santiago de Cuba, Cuba', capacity = 500, shape = 'herradura' WHERE name = 'Teatro Martí';
UPDATE venues SET address = 'Calle Galiano y Concordia, La Habana, Cuba', capacity = 1000, shape = 'herradura' WHERE name = 'Teatro América';
UPDATE venues SET address = 'Calle 26, Nuevo Vedado, La Habana, Cuba', capacity = 800, shape = 'rectangular' WHERE name = 'Fábrica de Arte Cubano (FAC)';
UPDATE venues SET address = 'Marta Abreu, Santa Clara, Cuba', capacity = 300, shape = 'rectangular' WHERE name = 'El Mejunje (Santa Clara)';
UPDATE venues SET address = 'Calle 25, Vedado, La Habana, Cuba', capacity = 200, shape = 'rectangular' WHERE name = 'El Proyecto';

-- 🎸 SALAS DE MÚSICA EN VIVO
UPDATE venues SET address = 'Calle 2, Vedado, La Habana, Cuba', capacity = 400, shape = 'rectangular' WHERE name = 'Sala Santiago Feliú (FAC)';
UPDATE venues SET address = 'Calle 10, Miramar, La Habana, Cuba', capacity = 300, shape = 'rectangular' WHERE name = 'Nave 3 (FAC)';
UPDATE venues SET address = 'Calle 26, Nuevo Vedado, La Habana, Cuba', capacity = 500, shape = 'rectangular' WHERE name = 'Nave 4 (FAC)';
UPDATE venues SET address = 'Calle 23, Vedado, La Habana, Cuba', capacity = 350, shape = 'rectangular' WHERE name = 'El Gato Tuerto';
UPDATE venues SET address = 'Avenida 47, Reparto Kohly, La Habana, Cuba', capacity = 600, shape = 'rectangular' WHERE name = 'Casa de la Música de Centro Habana';
UPDATE venues SET address = 'Calle 31, Vedado, La Habana, Cuba', capacity = 450, shape = 'rectangular' WHERE name = 'Café Cantante Mi Habana';
