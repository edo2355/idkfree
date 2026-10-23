CREATE TABLE IF NOT EXISTS user_payment_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'qvapay', 'transfermovil', 'stripe', etc.
  account_data TEXT NOT NULL, -- El @usuario o la tarjeta
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS money_transfers (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_account TEXT NOT NULL, -- @usuario o tarjeta destino
  provider TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  receipt_url TEXT, -- URL de la imagen del comprobante
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
