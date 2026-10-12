-- ============================================================
-- 014_reposts.sql — Republicar posts + dibujos (ya existe drawn_posts en 013)
-- ============================================================

-- Añadir columnas a posts para reposts
ALTER TABLE posts ADD COLUMN original_post_id TEXT REFERENCES posts(id);
ALTER TABLE posts ADD COLUMN is_repost INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_posts_original ON posts(original_post_id);
