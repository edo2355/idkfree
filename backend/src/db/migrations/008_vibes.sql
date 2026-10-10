-- ============================================================
-- 008_vibes.sql
-- Vibes: señales efímeras de 24h + resonancias mutuas
-- ============================================================

CREATE TABLE IF NOT EXISTS vibes (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood        TEXT NOT NULL CHECK (mood IN ('silencio','charlar','crear','tranquilo','nose')),
  message     TEXT CHECK (message IS NULL OR length(message) <= 140),
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vibes_user_active ON vibes(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_vibes_expires ON vibes(expires_at);

CREATE TABLE IF NOT EXISTS vibe_resonances (
  vibe_id     TEXT NOT NULL REFERENCES vibes(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (vibe_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_vibe_resonances_user ON vibe_resonances(user_id);
CREATE INDEX IF NOT EXISTS idx_vibe_resonances_vibe ON vibe_resonances(vibe_id);
