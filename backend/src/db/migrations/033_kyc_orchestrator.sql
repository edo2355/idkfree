CREATE TABLE IF NOT EXISTS kyc_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_used TEXT NOT NULL, -- 'telegram', 'sumsub', 'manual'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  document_type TEXT,
  verified_at DATETIME,
  metadata TEXT, -- JSON extra
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
