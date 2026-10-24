CREATE TABLE IF NOT EXISTS user_payment_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  account_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS money_transfers (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_account TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  receipt_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);