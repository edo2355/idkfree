CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  provider TEXT NOT NULL,
  remote_id TEXT UNIQUE,
  payment_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
