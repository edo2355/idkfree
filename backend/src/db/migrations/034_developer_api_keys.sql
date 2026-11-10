CREATE TABLE IF NOT EXISTS developer_api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  api_secret TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'revoked'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
