CREATE TABLE IF NOT EXISTS phone_otps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_phone_otps_lookup ON phone_otps(phone_number, otp_code);
