-- ==========================================
-- EE. UU.: TEATROS HISTÓRICOS Y RECINTOS PEQUEÑOS
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Proctor''s Theater (Troy, NY)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Oriental Theater (Milwaukee, WI)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Egyptian Theater (Delta, CO)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Miller Theatre (Augusta, GA)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Adler Theatre (Davenport, IA)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Pickwick Theatre (Park Ridge, IL)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Arch Social Club / Schanze Theatre (Baltimore, MD)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Fisher Theatre (Detroit, MI)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Majestic Theatre (San Antonio, TX)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Bayview Opera House (San Francisco, CA)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'The Annie Russell Theater (Winter Park, FL)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'The Strand (Rockland, ME)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'The Colonial Theatre (Phoenixville, PA)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'The Sheldon Theater (Red Wing, MN)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Tampa Theatre (Tampa, FL)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Orpheum Theater (Phoenix, AZ)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Shanklin Music Hall (Groton, MA)', 'sala de conciertos', 'US'),
(lower(hex(randomblob(16))), 'Harmony Wynelands (Lodi, CA)', 'sala de conciertos', 'US'),
(lower(hex(randomblob(16))), 'Ace Theater (Los Angeles, CA)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'The Kentucky Theatre (Lexington, KY)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Lake Country Playhouse (Hartland, WI)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Raleigh Little Theatre (Raleigh, NC)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Tibbits Opera House (Coldwater, MI)', 'teatro', 'US'),
(lower(hex(randomblob(16))), 'Rex Theatre (Morenci, MI)', 'teatro', 'US');

-- ==========================================
-- LATAM: ARGENTINA (AR)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Monumental (River Plate)', 'estadio', 'AR'),
(lower(hex(randomblob(16))), 'Estadio Vélez Sarsfield', 'estadio', 'AR'),
(lower(hex(randomblob(16))), 'Movistar Arena (Buenos Aires)', 'arena', 'AR'),
(lower(hex(randomblob(16))), 'Luna Park', 'arena', 'AR'),
(lower(hex(randomblob(16))), 'Estadio Cubierto Malvinas Argentinas', 'arena', 'AR'),
(lower(hex(randomblob(16))), 'Teatro Gran Rex', 'teatro', 'AR'),
(lower(hex(randomblob(16))), 'Estadio Obras Sanitarias', 'estadio', 'AR'),
(lower(hex(randomblob(16))), 'Teatro Vorterix', 'teatro', 'AR'),
(lower(hex(randomblob(16))), 'Teatro 25 de Mayo', 'teatro', 'AR'),
(lower(hex(randomblob(16))), 'Estadio Único Madre de Ciudades', 'estadio', 'AR'),
(lower(hex(randomblob(16))), 'Teatro Alberdi', 'teatro', 'AR');

-- ==========================================
-- LATAM: BRASIL (BR)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Maracanã', 'estadio', 'BR'),
(lower(hex(randomblob(16))), 'Morumbis', 'estadio', 'BR'),
(lower(hex(randomblob(16))), 'Allianz Parque', 'estadio', 'BR'),
(lower(hex(randomblob(16))), 'Mineirão', 'estadio', 'BR'),
(lower(hex(randomblob(16))), 'Neo Química Arena', 'estadio', 'BR'),
(lower(hex(randomblob(16))), 'Arena do Grêmio', 'estadio', 'BR'),
(lower(hex(randomblob(16))), 'Gigantinho', 'arena', 'BR'),
(lower(hex(randomblob(16))), 'Vibra São Paulo', 'arena', 'BR'),
(lower(hex(randomblob(16))), 'Qualistage', 'arena', 'BR'),
(lower(hex(randomblob(16))), 'Theatro Municipal do Rio de Janeiro', 'teatro', 'BR'),
(lower(hex(randomblob(16))), 'Theatro São Pedro', 'teatro', 'BR'),
(lower(hex(randomblob(16))), 'Teatro Guaíra', 'teatro', 'BR'),
(lower(hex(randomblob(16))), 'Cine Joia', 'teatro', 'BR'),
(lower(hex(randomblob(16))), 'Cine Theatro Brasil Vallourec', 'teatro', 'BR'),
(lower(hex(randomblob(16))), 'Teatro Jorge Amado', 'teatro', 'BR'),
(lower(hex(randomblob(16))), 'Sala São Paulo', 'auditorio', 'BR');

-- ==========================================
-- LATAM: MÉXICO (MX)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Azteca', 'estadio', 'MX'),
(lower(hex(randomblob(16))), 'Estadio Olímpico Universitario', 'estadio', 'MX'),
(lower(hex(randomblob(16))), 'Estadio GNP Seguros (Foro Sol)', 'estadio', 'MX'),
(lower(hex(randomblob(16))), 'Arena Ciudad de México', 'arena', 'MX'),
(lower(hex(randomblob(16))), 'Palacio de los Deportes', 'arena', 'MX'),
(lower(hex(randomblob(16))), 'Auditorio Nacional', 'auditorio', 'MX'),
(lower(hex(randomblob(16))), 'Palacio de Bellas Artes', 'teatro', 'MX'),
(lower(hex(randomblob(16))), 'Teatro Metropólitan', 'teatro', 'MX'),
(lower(hex(randomblob(16))), 'Pepsi Center WTC', 'arena', 'MX'),
(lower(hex(randomblob(16))), 'Auditorio Blackberry', 'auditorio', 'MX'),
(lower(hex(randomblob(16))), 'Foro Cultural Hilvana', 'centro cultural', 'MX');

-- ==========================================
-- LATAM: COLOMBIA (CO)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Nemesio Camacho El Campín', 'estadio', 'CO'),
(lower(hex(randomblob(16))), 'Estadio Metropolitano Roberto Meléndez', 'estadio', 'CO'),
(lower(hex(randomblob(16))), 'Estadio Atanasio Girardot', 'estadio', 'CO'),
(lower(hex(randomblob(16))), 'Movistar Arena (Bogotá)', 'arena', 'CO'),
(lower(hex(randomblob(16))), 'Arena Cañaveralejo', 'arena', 'CO'),
(lower(hex(randomblob(16))), 'Centro de Espectáculos La Macarena', 'arena', 'CO'),
(lower(hex(randomblob(16))), 'Plaza Cultural la Santamaría', 'plaza', 'CO'),
(lower(hex(randomblob(16))), 'Teatro Colón (Bogotá)', 'teatro', 'CO'),
(lower(hex(randomblob(16))), 'Teatro Royal Center', 'teatro', 'CO'),
(lower(hex(randomblob(16))), 'Teatro Al Aire Libre Carlos Vieco', 'anfiteatro', 'CO');

-- ==========================================
-- LATAM: CHILE (CL)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Nacional Julio Martínez Prádanos', 'estadio', 'CL'),
(lower(hex(randomblob(16))), 'Estadio Monumental David Arellano', 'estadio', 'CL'),
(lower(hex(randomblob(16))), 'Estadio Bicentenario de La Florida', 'estadio', 'CL'),
(lower(hex(randomblob(16))), 'Movistar Arena (Santiago)', 'arena', 'CL'),
(lower(hex(randomblob(16))), 'Teatro Caupolicán', 'teatro', 'CL'),
(lower(hex(randomblob(16))), 'Teatro Municipal de Santiago', 'teatro', 'CL'),
(lower(hex(randomblob(16))), 'Teatro Municipal de Viña del Mar', 'teatro', 'CL'),
(lower(hex(randomblob(16))), 'Teatro Nacional Chileno', 'teatro', 'CL'),
(lower(hex(randomblob(16))), 'Anfiteatro de la Quinta Vergara', 'anfiteatro', 'CL'),
(lower(hex(randomblob(16))), 'Teatro Coliseo (Santiago)', 'teatro', 'CL');

-- ==========================================
-- LATAM: PERÚ (PE)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Monumental (Lima)', 'estadio', 'PE'),
(lower(hex(randomblob(16))), 'Estadio Nacional del Perú', 'estadio', 'PE'),
(lower(hex(randomblob(16))), 'Estadio Universidad San Marcos', 'estadio', 'PE'),
(lower(hex(randomblob(16))), 'Coliseo Amauta', 'coliseo', 'PE'),
(lower(hex(randomblob(16))), 'Coliseo Eduardo Dibos', 'coliseo', 'PE'),
(lower(hex(randomblob(16))), 'Anfiteatro Parque de la Exposición', 'anfiteatro', 'PE'),
(lower(hex(randomblob(16))), 'Teatro Municipal de Lima', 'teatro', 'PE'),
(lower(hex(randomblob(16))), 'Teatro Mario Vargas Llosa', 'teatro', 'PE'),
(lower(hex(randomblob(16))), 'Teatro Ricardo Blume', 'teatro', 'PE'),
(lower(hex(randomblob(16))), 'Arena 1 Costa Verde', 'arena', 'PE');

-- ==========================================
-- LATAM: ECUADOR (EC)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Olímpico Atahualpa', 'estadio', 'EC'),
(lower(hex(randomblob(16))), 'Estadio Monumental Isidro Romero Carbo', 'estadio', 'EC'),
(lower(hex(randomblob(16))), 'Estadio George Capwell', 'estadio', 'EC'),
(lower(hex(randomblob(16))), 'Estadio Bellavista', 'estadio', 'EC'),
(lower(hex(randomblob(16))), 'Coliseo General Rumiñahui', 'coliseo', 'EC'),
(lower(hex(randomblob(16))), 'Teatro Nacional Sucre', 'teatro', 'EC'),
(lower(hex(randomblob(16))), 'Teatro Centro Cívico Eloy Alfaro', 'teatro', 'EC');

-- ==========================================
-- LATAM: VENEZUELA (VE)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Monumental de Maturín', 'estadio', 'VE'),
(lower(hex(randomblob(16))), 'Estadio Monumental de Caracas', 'estadio', 'VE'),
(lower(hex(randomblob(16))), 'Poliedro de Caracas', 'arena', 'VE'),
(lower(hex(randomblob(16))), 'Palacio de Eventos de Venezuela', 'arena', 'VE'),
(lower(hex(randomblob(16))), 'Forum de Valencia', 'arena', 'VE'),
(lower(hex(randomblob(16))), 'Teatro Teresa Carreño', 'teatro', 'VE'),
(lower(hex(randomblob(16))), 'Teatro Municipal de Chacao', 'teatro', 'VE'),
(lower(hex(randomblob(16))), 'Ateneo de El Hatillo', 'centro cultural', 'VE');

-- ==========================================
-- LATAM: URUGUAY (UY)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Centenario', 'estadio', 'UY'),
(lower(hex(randomblob(16))), 'Estadio Gran Parque Central', 'estadio', 'UY'),
(lower(hex(randomblob(16))), 'Antel Arena', 'arena', 'UY'),
(lower(hex(randomblob(16))), 'Palacio Peñarol', 'arena', 'UY'),
(lower(hex(randomblob(16))), 'Teatro Solís', 'teatro', 'UY'),
(lower(hex(randomblob(16))), 'Auditorio Nacional Adela Reta', 'auditorio', 'UY'),
(lower(hex(randomblob(16))), 'Sala Zitarrosa', 'sala de conciertos', 'UY'),
(lower(hex(randomblob(16))), 'Teatro de Verano (Montevideo)', 'anfiteatro', 'UY');

-- ==========================================
-- LATAM: PARAGUAY (PY)
-- ==========================================
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio General Pablo Rojas', 'estadio', 'PY'),
(lower(hex(randomblob(16))), 'Estadio Defensores del Chaco', 'estadio', 'PY'),
(lower(hex(randomblob(16))), 'SND Arena', 'arena', 'PY'),
(lower(hex(randomblob(16))), 'Teatro Municipal Ignacio A. Pane', 'teatro', 'PY'),
(lower(hex(randomblob(16))), 'Teatro Guaraní', 'teatro', 'PY'),
(lower(hex(randomblob(16))), 'Teatro de las Américas CCPA', 'teatro', 'PY');
