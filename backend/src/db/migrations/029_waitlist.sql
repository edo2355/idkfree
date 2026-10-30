-- Migration 029: Lista de espera (Waitlist) para lanzamiento
CREATE TABLE IF NOT EXISTS waitlist (
  id TEXT PRIMARY KEY,
  alias TEXT NOT NULL UNIQUE,
  email TEXT,
  referral_code TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL,
  is_early_access INTEGER NOT NULL DEFAULT 0,
  invited_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist(position);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_waitlist_referral ON waitlist(referral_code);
