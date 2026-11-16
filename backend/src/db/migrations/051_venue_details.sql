ALTER TABLE venues ADD COLUMN address TEXT;
ALTER TABLE venues ADD COLUMN capacity INTEGER;

-- Actualizamos algunos recintos con datos reales de ejemplo para que veas el mapa
UPDATE venues SET address = 'Av. de Concha Espina, 1, 28036 Madrid, España', capacity = 83186 WHERE name = 'Santiago Bernabéu';
UPDATE venues SET address = 'C. Antón Martín, 28012 Madrid, España', capacity = 15000 WHERE name = 'Teatro Real'; -- Ejemplo
UPDATE venues SET address = '1 Legends Way, Arlington, TX 76011, USA', capacity = 80000 WHERE name = 'AT&T Stadium';
UPDATE venues SET address = 'Calle 23 y L, Vedado, La Habana, Cuba', capacity = 5500 WHERE name = 'Teatro Karl Marx';
