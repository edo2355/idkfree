CREATE TABLE IF NOT EXISTS fenix_migrations (
  id TEXT PRIMARY KEY,
  old_user_id TEXT NOT NULL,
  new_user_id TEXT NOT NULL,
  old_email TEXT NOT NULL,
  new_email TEXT NOT NULL,
  migrated_at TEXT
);
