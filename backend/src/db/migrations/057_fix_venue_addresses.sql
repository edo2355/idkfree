-- Actualizamos las direcciones y capacidades de los coliseos de Puerto Rico y otros emblemáticos
UPDATE venues SET address = 'Avenida Franklin Delano Roosevelt, San Juan, 00920, Puerto Rico', capacity = 10000 WHERE name = 'Coliseo Roberto Clemente';
UPDATE venues SET address = '500 Calle Arterial Hostos, San Juan, 00918, Puerto Rico', capacity = 18000 WHERE name = 'Coliseo de Puerto Rico José Miguel Agrelot';
UPDATE venues SET address = 'Avenida 65 de Infantería, Carolina, 00985, Puerto Rico', capacity = 9000 WHERE name = 'Coliseo Guillermo Angulo';
UPDATE venues SET address = 'Avenida México 101, La Habana, Cuba', capacity = 15000 WHERE name = 'Coliseo de la Ciudad Deportiva';

-- Podemos aprovechar para darle dirección a las arenas de EE.UU. más famosas
UPDATE venues SET address = '4 Pennsylvania Plaza, New York, NY 10001, USA', capacity = 20789 WHERE name = 'Madison Square Garden';
UPDATE venues SET address = '1111 S Figueroa St, Los Angeles, CA 90015, USA', capacity = 20000 WHERE name = 'Crypto.com Arena';
