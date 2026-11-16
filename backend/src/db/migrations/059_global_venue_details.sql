-- ==========================================
-- ACTUALIZAR DIRECCIONES Y CAPACIDADES
-- ==========================================

-- 🇸🇪 SUECIA
UPDATE venues SET address = 'Evenemangsgatan 20, 169 79 Solna, Suecia', capacity = 65000 WHERE name = 'Strawberry Arena';
UPDATE venues SET address = 'Skånegatan 17, 411 40 Göteborg, Suecia', capacity = 75000 WHERE name = 'Ullevi';
UPDATE venues SET address = 'Eric Perssons väg 31, 217 62 Malmö, Suecia', capacity = 22500 WHERE name = 'Eleda Stadion';

-- 🇩🇰 DINAMARCA
UPDATE venues SET address = 'Per Henrik Lings Allé 2, 2100 København, Dinamarca', capacity = 38000 WHERE name = 'Parken Stadium';
UPDATE venues SET address = 'Brøndby Stadion 32, 2605 Brøndby, Dinamarca', capacity = 29000 WHERE name = 'Brøndby Stadion';

-- 🇫🇮 FINLANDIA
UPDATE venues SET address = 'Paavo Nurmen tie 1, 00250 Helsinki, Finlandia', capacity = 40000 WHERE name = 'Helsinki Olympic Stadium';

-- 🇳🇴 NORUEGA
UPDATE venues SET address = 'Rolf Olsens vei 1, 1344 Haslum, Noruega', capacity = 15000 WHERE name = 'Telenor Arena';
UPDATE venues SET address = 'Gamle Jåttåvågen, 4020 Stavanger, Noruega', capacity = 15000 WHERE name = 'Viking Stadion';

-- 🇵🇱 POLONIA
UPDATE venues SET address = 'Stanisława Lema 7, 31-571 Kraków, Polonia', capacity = 22000 WHERE name = 'Tauron Arena Kraków';
UPDATE venues SET address = 'aleja Politechniki 1, 93-455 Łódź, Polonia', capacity = 13000 WHERE name = 'Atlas Arena';

-- 🇦🇺 AUSTRALIA
UPDATE venues SET address = 'Edwin Flack Ave, Sydney Olympic Park NSW 2127, Australia', capacity = 83500 WHERE name = 'ANZ Stadium';
UPDATE venues SET address = '740 Bourke St, Docklands VIC 3008, Australia', capacity = 56000 WHERE name = 'Marvel Stadium';
UPDATE venues SET address = '250 St Georges Terrace, Perth WA 6000, Australia', capacity = 60000 WHERE name = 'Optus Stadium';

-- 🇳🇿 NUEVA ZELANDA
UPDATE venues SET address = '42 Mahuhu Crescent, Auckland CBD, Auckland 1010, Nueva Zelanda', capacity = 12000 WHERE name = 'Spark Arena';
UPDATE venues SET address = 'Anzac Ave, Dunedin 9016, Nueva Zelanda', capacity = 30000 WHERE name = 'Forsyth Barr Stadium';
