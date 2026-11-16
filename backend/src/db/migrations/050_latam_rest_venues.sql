-- ==========================================
-- LATAM: CENTROAMÉRICA Y PAÍSES RESTANTES
-- ==========================================

-- 🇬🇹 GUATEMALA (GT)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Doroteo Guamuch Flores', 'estadio', 'GT'),
(lower(hex(randomblob(16))), 'Estadio Mario Camposeco', 'estadio', 'GT'),
(lower(hex(randomblob(16))), 'Teatro Nacional Miguel Ángel Asturias', 'teatro', 'GT'),
(lower(hex(randomblob(16))), 'Centro Cultural Miguel Ángel Asturias', 'centro cultural', 'GT');

-- 🇭🇳 HONDURAS (HN)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Olímpico Metropolitano', 'estadio', 'HN'),
(lower(hex(randomblob(16))), 'Estadio Nacional de Tegucigalpa', 'estadio', 'HN'),
(lower(hex(randomblob(16))), 'Estadio Excelsior', 'estadio', 'HN');

-- 🇸🇻 EL SALVADOR (SV)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Cuscatlán', 'estadio', 'SV'),
(lower(hex(randomblob(16))), 'Estadio Nacional Jorge "El Mágico" González', 'estadio', 'SV'),
(lower(hex(randomblob(16))), 'Teatro Nacional de San Salvador', 'teatro', 'SV');

-- 🇳🇮 NICARAGUA (NI)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Nacional de Fútbol (Managua)', 'estadio', 'NI'),
(lower(hex(randomblob(16))), 'Teatro Nacional Rubén Darío', 'teatro', 'NI');

-- 🇨🇷 COSTA RICA (CR)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Nacional de Costa Rica', 'estadio', 'CR'),
(lower(hex(randomblob(16))), 'Estadio Alejandro Morera Soto', 'estadio', 'CR'),
(lower(hex(randomblob(16))), 'Teatro Nacional de Costa Rica', 'teatro', 'CR');

-- 🇵🇦 PANAMÁ (PA)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Rommel Fernández', 'estadio', 'PA'),
(lower(hex(randomblob(16))), 'Centro de Convenciones Amador', 'centro_convenciones', 'PA'),
(lower(hex(randomblob(16))), 'Teatro Nacional de Panamá', 'teatro', 'PA');

-- 🇧🇴 BOLIVIA (BO)
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Hernando Siles', 'estadio', 'BO'),
(lower(hex(randomblob(16))), 'Estadio Ramón Tahuichi Aguilera', 'estadio', 'BO'),
(lower(hex(randomblob(16))), 'Teatro Municipal Alberto Saavedra Pérez', 'teatro', 'BO');

-- 🇪🇨 ECUADOR (EC) - COMPLEMENTO
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio Rodrigo Paz Delgado', 'estadio', 'EC'),
(lower(hex(randomblob(16))), 'Estadio Christian Benítez', 'estadio', 'EC');

-- 🇵🇾 PARAGUAY (PY) - COMPLEMENTO
INSERT OR IGNORE INTO venues (id, name, type, country) VALUES
(lower(hex(randomblob(16))), 'Estadio ueno La Nueva Olla', 'estadio', 'PY'),
(lower(hex(randomblob(16))), 'Estadio Manuel Ferreira', 'estadio', 'PY');
