CREATE TABLE IF NOT EXISTS card_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id TEXT UNIQUE NOT NULL,
  recovery_secret_hash BLOB NOT NULL,
  pin_panic_hash BLOB NOT NULL,
  pin_recovery_hash BLOB NOT NULL,
  pin_destroy_hash BLOB NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
