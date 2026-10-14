-- ============================================================
-- 015_legacy_vibes.sql — Vibes legacy + media
-- ============================================================
ALTER TABLE vibes ADD COLUMN is_legacy INTEGER NOT NULL DEFAULT 0;
ALTER TABLE vibes ADD COLUMN media_url TEXT;
CREATE INDEX IF NOT EXISTS idx_vibes_legacy ON vibes(author_id, is_legacy);
