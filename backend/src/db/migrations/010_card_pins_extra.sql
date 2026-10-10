-- 010_card_pins_extra.sql
-- Añade 3 PINs secretos + 3 secrets para los QRs (panic, restore, fenix)

ALTER TABLE card_keys ADD COLUMN secret_panic TEXT;
ALTER TABLE card_keys ADD COLUMN secret_restore TEXT;
ALTER TABLE card_keys ADD COLUMN secret_fenix TEXT;
ALTER TABLE card_keys ADD COLUMN secret_pin_1_hash BLOB;
ALTER TABLE card_keys ADD COLUMN secret_pin_2_hash BLOB;
ALTER TABLE card_keys ADD COLUMN secret_pin_3_hash BLOB;
