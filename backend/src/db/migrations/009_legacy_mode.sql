-- ============================================================
-- 009_legacy_mode.sql
-- Modo Legado: perfil memorial cuando un usuario fallece
-- ============================================================

ALTER TABLE users ADD COLUMN legacy_mode INTEGER NOT NULL DEFAULT 0
  CHECK (legacy_mode IN (0, 1));

ALTER TABLE users ADD COLUMN legacy_message TEXT
  CHECK (legacy_message IS NULL OR length(legacy_message) <= 500);

ALTER TABLE users ADD COLUMN legacy_activated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_users_legacy ON users(legacy_mode) WHERE legacy_mode = 1;
