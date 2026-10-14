-- ============================================================
-- 015_legacy_vibes.sql — Vibes legacy + media + deleted_at
-- ============================================================
ALTER TABLE vibes ADD COLUMN is_legacy INTEGER NOT NULL DEFAULT 0;
ALTER TABLE vibes ADD COLUMN media_url TEXT;
ALTER TABLE vibes ADD COLUMN deleted_at TEXT;
CREATE INDEX IF NOT EXISTS idx_vibes_legacy ON vibes(user_id, is_legacy);
