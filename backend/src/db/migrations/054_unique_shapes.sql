-- Actualizamos las formas de los recintos más emblemáticos
UPDATE venues SET shape = 'sphere' WHERE name LIKE '%Sphere%';
UPDATE venues SET shape = 'bird_nest' WHERE name LIKE '%Bird''s Nest%' OR name = 'Beijing National Stadium';
UPDATE venues SET shape = 'hexagonal' WHERE name = 'Teatro Real';
UPDATE venues SET shape = 'd_shape' WHERE name LIKE '%Bombonera%';
