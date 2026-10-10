-- Añadir deleted_at a users (soft delete)
ALTER TABLE users ADD COLUMN deleted_at TEXT;
