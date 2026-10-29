-- Migration 026: Fundación cross-border (suppliers + influencers + diaspora)

ALTER TABLE users ADD COLUMN country_code TEXT NOT NULL DEFAULT 'CU';
ALTER TABLE users ADD COLUMN is_diaspora INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN is_international INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_users_country ON users(country_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_diaspora ON users(is_diaspora, created_at DESC)
  WHERE is_diaspora = 1;

CREATE TABLE IF NOT EXISTS supplier_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  categories TEXT,
  min_order_value REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  shipping_methods TEXT,
  contact_whatsapp TEXT,
  contact_email TEXT,
  contact_wechat TEXT,
  website TEXT,
  description TEXT,
  verified_at TEXT,
  verified_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_suppliers_country ON supplier_profiles(country_code, verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON supplier_profiles(verified_at DESC)
  WHERE verified_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS influencer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  niche TEXT,
  platforms TEXT,
  followers_count INTEGER NOT NULL DEFAULT 0,
  rate_per_post REAL,
  rate_per_live REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  languages TEXT,
  country_code TEXT,
  description TEXT,
  verified_at TEXT,
  verified_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_influencers_country ON influencer_profiles(country_code, verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencers_verified ON influencer_profiles(verified_at DESC)
  WHERE verified_at IS NOT NULL;
