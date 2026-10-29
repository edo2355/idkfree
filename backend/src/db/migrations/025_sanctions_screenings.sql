-- Migration 025: OFAC/AML sanctions screening
CREATE TABLE IF NOT EXISTS sanctions_screenings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  context TEXT NOT NULL,
  query_name TEXT NOT NULL,
  query_birth TEXT,
  query_country TEXT,
  score REAL NOT NULL DEFAULT 0,
  verdict TEXT NOT NULL,
  datasets TEXT,
  matches_json TEXT,
  provider TEXT NOT NULL DEFAULT 'opensanctions',
  provider_ref TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sanctions_user ON sanctions_screenings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sanctions_verdict ON sanctions_screenings(verdict, created_at DESC) WHERE verdict IN ('review','blocked','error');
