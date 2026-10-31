-- Migration 030: sistema de referidos en waitlist
ALTER TABLE waitlist ADD COLUMN referred_by_id TEXT;
ALTER TABLE waitlist ADD COLUMN referred_by_code TEXT;

CREATE INDEX IF NOT EXISTS idx_waitlist_referred_by
  ON waitlist(referred_by_id)
  WHERE referred_by_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code
  ON waitlist(referral_code);
