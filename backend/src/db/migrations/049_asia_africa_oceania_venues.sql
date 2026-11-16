-- ==========================================
-- ASIA, ÁFRICA Y OCEANÍA
-- ==========================================

-- 🇯🇵 JAPÓN (JP)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Tokyo Dome', 'estadio', 'JP'),
(lower(hex(randomblob(16))), 'Saitama Super Arena', 'arena', 'JP'),
(lower(hex(randomblob(16))), 'Nippon Budokan', 'arena', 'JP'),
(lower(hex(randomblob(16))), 'Osaka-jo Hall', 'arena', 'JP'),
(lower(hex(randomblob(16))), 'Kabukiza Theatre', 'teatro', 'JP'),
(lower(hex(randomblob(16))), 'New National Theatre Tokyo', 'teatro', 'JP');

-- 🇰🇷 COREA DEL SUR (KR)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Seoul Olympic Stadium', 'estadio', 'KR'),
(lower(hex(randomblob(16))), 'Seoul World Cup Stadium', 'estadio', 'KR'),
(lower(hex(randomblob(16))), 'KSPO Dome', 'arena', 'KR'),
(lower(hex(randomblob(16))), 'Gocheok Sky Dome', 'estadio_cubierto', 'KR'),
(lower(hex(randomblob(16))), 'Blue Square', 'sala de conciertos', 'KR');

-- 🇨🇳 CHINA (CN)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Beijing National Stadium (Bird''s Nest)', 'estadio', 'CN'),
(lower(hex(randomblob(16))), 'Shanghai Stadium', 'estadio', 'CN'),
(lower(hex(randomblob(16))), 'Mercedes-Benz Arena Shanghai', 'arena', 'CN'),
(lower(hex(randomblob(16))), 'National Centre for the Performing Arts', 'teatro', 'CN');

-- 🇮🇳 INDIA (IN)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Narendra Modi Stadium', 'estadio', 'IN'),
(lower(hex(randomblob(16))), 'Wankhede Stadium', 'estadio', 'IN'),
(lower(hex(randomblob(16))), 'Jawaharlal Nehru Stadium (Delhi)', 'estadio', 'IN'),
(lower(hex(randomblob(16))), 'Indira Gandhi Arena', 'arena', 'IN');

-- 🇦🇪 EMIRATOS ÁRABES UNIDOS (AE)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Coca-Cola Arena', 'arena', 'AE'),
(lower(hex(randomblob(16))), 'Etihad Arena', 'arena', 'AE'),
(lower(hex(randomblob(16))), 'Dubai Opera', 'teatro', 'AE');

-- 🇿🇦 SUDÁFRICA (ZA)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'FNB Stadium', 'estadio', 'ZA'),
(lower(hex(randomblob(16))), 'Cape Town Stadium', 'estadio', 'ZA'),
(lower(hex(randomblob(16))), 'Ellis Park Stadium', 'estadio', 'ZA'),
(lower(hex(randomblob(16))), 'SunBet Arena (Time Square)', 'arena', 'ZA'),
(lower(hex(randomblob(16))), 'Artscape Theatre Centre', 'teatro', 'ZA');

-- 🇪🇬 EGIPTO (EG)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Cairo International Stadium', 'estadio', 'EG'),
(lower(hex(randomblob(16))), 'Borg El Arab Stadium', 'estadio', 'EG'),
(lower(hex(randomblob(16))), 'Cairo Opera House', 'teatro', 'EG');

-- 🇲🇦 MARRUECOS (MA)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Stade Mohammed V', 'estadio', 'MA'),
(lower(hex(randomblob(16))), 'Stade de Marrakech', 'estadio', 'MA'),
(lower(hex(randomblob(16))), 'Grand Théâtre de Rabat', 'teatro', 'MA');

-- 🇳🇬 NIGERIA (NG)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Moshood Abiola National Stadium', 'estadio', 'NG'),
(lower(hex(randomblob(16))), 'Eko Convention Centre', 'centro_convenciones', 'NG');

-- 🇦🇺 AUSTRALIA (AU)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Melbourne Cricket Ground (MCG)', 'estadio', 'AU'),
(lower(hex(randomblob(16))), 'Stadium Australia (Accor Stadium)', 'estadio', 'AU'),
(lower(hex(randomblob(16))), 'Optus Stadium', 'estadio', 'AU'),
(lower(hex(randomblob(16))), 'Rod Laver Arena', 'arena', 'AU'),
(lower(hex(randomblob(16))), 'Qudos Bank Arena', 'arena', 'AU'),
(lower(hex(randomblob(16))), 'Sydney Opera House', 'teatro', 'AU');

-- 🇳🇿 NUEVA ZELANDA (NZ)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Eden Park', 'estadio', 'NZ'),
(lower(hex(randomblob(16))), 'Spark Arena', 'arena', 'NZ');
