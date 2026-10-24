CREATE TABLE IF NOT EXISTS kyc_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  document_photo TEXT,
  selfie_photo TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME
);
