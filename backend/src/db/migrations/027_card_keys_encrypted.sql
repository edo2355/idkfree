-- Migration 027: cifrar secretos de cards en reposo (AES-GCM)
-- Añade columnas *_enc (BLOB) manteniendo las TEXT viejas
-- durante transición. Rollback trivial: ignorar columnas nuevas.

ALTER TABLE card_keys ADD COLUMN secret_panic_enc BLOB;
ALTER TABLE card_keys ADD COLUMN secret_restore_enc BLOB;
ALTER TABLE card_keys ADD COLUMN secret_fenix_enc BLOB;
ALTER TABLE card_keys ADD COLUMN backup_panic_enc BLOB;
ALTER TABLE card_keys ADD COLUMN backup_restore_enc BLOB;
ALTER TABLE card_keys ADD COLUMN backup_fenix_enc BLOB;

CREATE INDEX IF NOT EXISTS idx_card_keys_encrypted
  ON card_keys(secret_panic_enc)
  WHERE secret_panic_enc IS NOT NULL;
