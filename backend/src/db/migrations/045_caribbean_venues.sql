-- ==========================================
-- RECINTOS DEL CARIBE Y LAS ANTILLAS
-- ==========================================

-- 🇨🇺 CUBA
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Latinoamericano', 'estadio', 'CU'),
(lower(hex(randomblob(16))), 'Estadio Pedro Marrero', 'estadio', 'CU'),
(lower(hex(randomblob(16))), 'Estadio Antonio Maceo', 'estadio', 'CU'),
(lower(hex(randomblob(16))), 'Estadio La Polar', 'estadio', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Karl Marx', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Gran Teatro de La Habana Alicia Alonso', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Nacional de Cuba', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Mella', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Teatro Amadeo Roldán', 'teatro', 'CU'),
(lower(hex(randomblob(16))), 'Anfiteatro Mariana Grajales', 'anfiteatro', 'CU');

-- 🇩🇴 REPÚBLICA DOMINICANA
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Olímpico Félix Sánchez', 'estadio', 'DO'),
(lower(hex(randomblob(16))), 'Estadio Quisqueya Juan Marichal', 'estadio', 'DO'),
(lower(hex(randomblob(16))), 'Estadio Cibao', 'estadio', 'DO'),
(lower(hex(randomblob(16))), 'Arena Santo Domingo', 'arena', 'DO'),
(lower(hex(randomblob(16))), 'Gran Arena del Cibao Dr. Oscar Gobaira', 'arena', 'DO'),
(lower(hex(randomblob(16))), 'Teatro Nacional Eduardo Brito', 'teatro', 'DO'),
(lower(hex(randomblob(16))), 'Gran Teatro del Cibao', 'teatro', 'DO'),
(lower(hex(randomblob(16))), 'Anfiteatro de Altos de Chavón', 'anfiteatro', 'DO'),
(lower(hex(randomblob(16))), 'Anfiteatro Nuryn Sanlley', 'anfiteatro', 'DO'),
(lower(hex(randomblob(16))), 'Anfiteatro La Gaviota', 'anfiteatro', 'DO'),
(lower(hex(randomblob(16))), 'Auditorio de Bellas Artes', 'auditorio', 'DO');

-- 🇵🇷 PUERTO RICO
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Hiram Bithorn', 'estadio', 'PR'),
(lower(hex(randomblob(16))), 'Estadio Sixto Escobar', 'estadio', 'PR'),
(lower(hex(randomblob(16))), 'Coliseo de Puerto Rico José Miguel Agrelot', 'arena', 'PR'),
(lower(hex(randomblob(16))), 'Coliseo Roberto Clemente', 'coliseo', 'PR'),
(lower(hex(randomblob(16))), 'Coliseo Rubén Rodríguez', 'coliseo', 'PR'),
(lower(hex(randomblob(16))), 'Anfiteatro Tito Puente', 'anfiteatro', 'PR'),
(lower(hex(randomblob(16))), 'Concha Acústica de Ponce', 'anfiteatro', 'PR'),
(lower(hex(randomblob(16))), 'Teatro Alejandro Tapia y Rivera', 'teatro', 'PR'),
(lower(hex(randomblob(16))), 'Anfiteatro Rafael Hernández', 'anfiteatro', 'PR');

-- 🇯🇲 JAMAICA
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'National Stadium (Independence Park)', 'estadio', 'JM'),
(lower(hex(randomblob(16))), 'Sabina Park', 'estadio', 'JM'),
(lower(hex(randomblob(16))), 'Montego Bay Sports Complex', 'estadio', 'JM'),
(lower(hex(randomblob(16))), 'Trelawny Stadium', 'estadio', 'JM'),
(lower(hex(randomblob(16))), 'Ranny Williams Entertainment Centre', 'anfiteatro', 'JM'),
(lower(hex(randomblob(16))), 'Little Theatre', 'teatro', 'JM'),
(lower(hex(randomblob(16))), 'Philip Sherlock Centre for the Creative Arts', 'teatro', 'JM'),
(lower(hex(randomblob(16))), 'Centre Stage Theatre', 'teatro', 'JM'),
(lower(hex(randomblob(16))), 'Louise Bennett Garden Theatre', 'teatro', 'JM');

-- 🇹🇹 TRINIDAD Y TOBAGO
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Hasely Crawford Stadium', 'estadio', 'TT'),
(lower(hex(randomblob(16))), 'Dwight Yorke Stadium', 'estadio', 'TT'),
(lower(hex(randomblob(16))), 'Brian Lara Stadium', 'estadio', 'TT'),
(lower(hex(randomblob(16))), 'Queen''s Park Oval', 'estadio', 'TT'),
(lower(hex(randomblob(16))), 'Ato Boldon Stadium', 'estadio', 'TT'),
(lower(hex(randomblob(16))), 'Jean Pierre Complex', 'arena', 'TT'),
(lower(hex(randomblob(16))), 'Sangre Grande Regional Complex', 'estadio', 'TT');

-- 🇧🇸 BAHAMAS
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Thomas A. Robinson National Stadium', 'estadio', 'BS'),
(lower(hex(randomblob(16))), 'Andre Rodgers Baseball Stadium', 'estadio', 'BS'),
(lower(hex(randomblob(16))), 'Nassau Stadium', 'estadio', 'BS'),
(lower(hex(randomblob(16))), 'Kendal G.L. Isaacs National Gymnasium', 'arena', 'BS');

-- 🇧🇧 BARBADOS
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Barbados National Stadium', 'estadio', 'BB'),
(lower(hex(randomblob(16))), 'Kensington Oval', 'estadio', 'BB'),
(lower(hex(randomblob(16))), 'Wildey Turf (Sir Garfield Sobers Complex)', 'estadio', 'BB'),
(lower(hex(randomblob(16))), 'Desmond Haynes Oval', 'estadio', 'BB'),
(lower(hex(randomblob(16))), 'Wahrendorff-Arena', 'estadio', 'BB');

-- 🇭🇹 HAITÍ
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Stade Sylvio Cator', 'estadio', 'HT');

-- 🇦🇼 ARUBA
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Compleho Deportivo Guillermo Prospero Trinidad', 'estadio', 'AW');

-- 🇨🇼 CURAZAO
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Stadion Ergilio Hato', 'estadio', 'CW');

-- 🇱🇨 SANTA LUCÍA
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Darren Sammy Cricket Ground', 'estadio', 'LC');

-- 🇻🇨 SAN VICENTE Y LAS GRANADINAS
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Arnos Vale Playing Ground', 'estadio', 'VC');

-- 🇦🇬 ANTIGUA Y BARBUDA
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'ABFA Technical Centre', 'estadio', 'AG');

-- 🇻🇬 ISLAS VÍRGENES BRITÁNICAS
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Shirley Recreational Field', 'estadio', 'VG');

-- 🇻🇮 ISLAS VÍRGENES DE EE. UU.
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Bethlehem Soccer Complex', 'estadio', 'VI');
