-- ==========================================
-- EUROPA: ESTADIOS, ARENAS, TEATROS Y SALAS
-- ==========================================

-- 🇬🇧 REINO UNIDO (GB)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Wembley Stadium', 'estadio', 'GB'),
(lower(hex(randomblob(16))), 'Tottenham Hotspur Stadium', 'estadio', 'GB'),
(lower(hex(randomblob(16))), 'Emirates Stadium', 'estadio', 'GB'),
(lower(hex(randomblob(16))), 'Anfield', 'estadio', 'GB'),
(lower(hex(randomblob(16))), 'Old Trafford', 'estadio', 'GB'),
(lower(hex(randomblob(16))), 'The O2 Arena', 'arena', 'GB'),
(lower(hex(randomblob(16))), 'OVO Arena Wembley', 'arena', 'GB'),
(lower(hex(randomblob(16))), 'Royal Albert Hall', 'sala de conciertos', 'GB'),
(lower(hex(randomblob(16))), 'O2 Academy Brixton', 'sala de conciertos', 'GB'),
(lower(hex(randomblob(16))), 'Eventim Apollo', 'teatro', 'GB'),
(lower(hex(randomblob(16))), 'Roundhouse', 'teatro', 'GB');

-- 🇪🇸 ESPAÑA (ES)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Spotify Camp Nou', 'estadio', 'ES'),
(lower(hex(randomblob(16))), 'Santiago Bernabéu', 'estadio', 'ES'),
(lower(hex(randomblob(16))), 'Estadio Metropolitano', 'estadio', 'ES'),
(lower(hex(randomblob(16))), 'Estadio de La Cartuja', 'estadio', 'ES'),
(lower(hex(randomblob(16))), 'Palau Sant Jordi', 'arena', 'ES'),
(lower(hex(randomblob(16))), 'WiZink Center', 'arena', 'ES'),
(lower(hex(randomblob(16))), 'Roig Arena', 'arena', 'ES'),
(lower(hex(randomblob(16))), 'Palau de les Arts Reina Sofía', 'auditorio', 'ES'),
(lower(hex(randomblob(16))), 'Auditorio de Tenerife', 'auditorio', 'ES'),
(lower(hex(randomblob(16))), 'Teatro Real', 'teatro', 'ES'),
(lower(hex(randomblob(16))), 'Gran Teatre del Liceu', 'teatro', 'ES'),
(lower(hex(randomblob(16))), 'Teatro María Guerrero', 'teatro', 'ES');

-- 🇫🇷 FRANCIA (FR)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Stade de France', 'estadio', 'FR'),
(lower(hex(randomblob(16))), 'Parc des Princes', 'estadio', 'FR'),
(lower(hex(randomblob(16))), 'Orange Vélodrome', 'estadio', 'FR'),
(lower(hex(randomblob(16))), 'Accor Arena (Bercy)', 'arena', 'FR'),
(lower(hex(randomblob(16))), 'LDLC Arena', 'arena', 'FR'),
(lower(hex(randomblob(16))), 'Zénith de Paris', 'sala de conciertos', 'FR'),
(lower(hex(randomblob(16))), 'Olympia', 'teatro', 'FR'),
(lower(hex(randomblob(16))), 'Philharmonie de Paris', 'auditorio', 'FR'),
(lower(hex(randomblob(16))), 'Opéra Garnier', 'teatro', 'FR'),
(lower(hex(randomblob(16))), 'Théâtre du Châtelet', 'teatro', 'FR');

-- 🇩🇪 ALEMANIA (DE)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Allianz Arena', 'estadio', 'DE'),
(lower(hex(randomblob(16))), 'Signal Iduna Park', 'estadio', 'DE'),
(lower(hex(randomblob(16))), 'Olympiastadion Berlin', 'estadio', 'DE'),
(lower(hex(randomblob(16))), 'Mercedes-Benz Arena (Stuttgart)', 'arena', 'DE'),
(lower(hex(randomblob(16))), 'Lanxess Arena', 'arena', 'DE'),
(lower(hex(randomblob(16))), 'Uber Arena Berlin', 'arena', 'DE'),
(lower(hex(randomblob(16))), 'Elbphilharmonie', 'auditorio', 'DE'),
(lower(hex(randomblob(16))), 'Philharmonie Berlin', 'auditorio', 'DE'),
(lower(hex(randomblob(16))), 'Konzerthaus Berlin', 'sala de conciertos', 'DE'),
(lower(hex(randomblob(16))), 'Waldbühne', 'anfiteatro', 'DE');

-- 🇮🇹 ITALIA (IT)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'San Siro (Giuseppe Meazza)', 'estadio', 'IT'),
(lower(hex(randomblob(16))), 'Stadio Olimpico (Roma)', 'estadio', 'IT'),
(lower(hex(randomblob(16))), 'Allianz Stadium (Turin)', 'estadio', 'IT'),
(lower(hex(randomblob(16))), 'Mediolanum Forum', 'arena', 'IT'),
(lower(hex(randomblob(16))), 'Unipol Arena', 'arena', 'IT'),
(lower(hex(randomblob(16))), 'Arena di Verona', 'anfiteatro', 'IT'),
(lower(hex(randomblob(16))), 'Teatro alla Scala', 'teatro', 'IT'),
(lower(hex(randomblob(16))), 'Teatro La Fenice', 'teatro', 'IT'),
(lower(hex(randomblob(16))), 'Auditorium Parco della Musica', 'auditorio', 'IT');

-- 🇵🇹 PORTUGAL (PT)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estádio da Luz', 'estadio', 'PT'),
(lower(hex(randomblob(16))), 'Estádio do Dragão', 'estadio', 'PT'),
(lower(hex(randomblob(16))), 'Altice Arena (MEO Arena)', 'arena', 'PT'),
(lower(hex(randomblob(16))), 'Super Bock Arena', 'arena', 'PT'),
(lower(hex(randomblob(16))), 'Teatro Nacional de São Carlos', 'teatro', 'PT'),
(lower(hex(randomblob(16))), 'Coliseu dos Recreios', 'coliseo', 'PT'),
(lower(hex(randomblob(16))), 'Casa da Música', 'sala de conciertos', 'PT');

-- 🇳🇱 PAÍSES BAJOS (NL)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Johan Cruijff ArenA', 'estadio', 'NL'),
(lower(hex(randomblob(16))), 'Ziggo Dome', 'arena', 'NL'),
(lower(hex(randomblob(16))), 'Ahoy Rotterdam', 'arena', 'NL'),
(lower(hex(randomblob(16))), 'AFAS Live', 'sala de conciertos', 'NL'),
(lower(hex(randomblob(16))), 'Concertgebouw', 'auditorio', 'NL'),
(lower(hex(randomblob(16))), 'Melkweg', 'club', 'NL'),
(lower(hex(randomblob(16))), 'Paradiso', 'club', 'NL');

-- 🇧🇪 BÉLGICA (BE)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'King Baudouin Stadium', 'estadio', 'BE'),
(lower(hex(randomblob(16))), 'Sportpaleis', 'arena', 'BE'),
(lower(hex(randomblob(16))), 'Forest National', 'arena', 'BE'),
(lower(hex(randomblob(16))), 'Ancienne Belgique', 'sala de conciertos', 'BE'),
(lower(hex(randomblob(16))), 'La Monnaie (De Munt)', 'teatro', 'BE');

-- 🇨🇭 SUIZA (CH)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'St. Jakob-Park', 'estadio', 'CH'),
(lower(hex(randomblob(16))), 'Stade de Genève', 'estadio', 'CH'),
(lower(hex(randomblob(16))), 'St. Jakobshalle', 'arena', 'CH'),
(lower(hex(randomblob(16))), 'Hallenstadion', 'arena', 'CH'),
(lower(hex(randomblob(16))), 'Palais de Beaulieu', 'teatro', 'CH');

-- 🇦🇹 AUSTRIA (AT)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Ernst-Happel-Stadion', 'estadio', 'AT'),
(lower(hex(randomblob(16))), 'Red Bull Arena (Salzburg)', 'estadio', 'AT'),
(lower(hex(randomblob(16))), 'Wiener Stadthalle', 'arena', 'AT'),
(lower(hex(randomblob(16))), 'Musikverein', 'auditorio', 'AT'),
(lower(hex(randomblob(16))), 'Konzerthaus Wien', 'sala de conciertos', 'AT');
