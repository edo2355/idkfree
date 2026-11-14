-- 1. ESCROW (Protección de Pagos)
CREATE TABLE IF NOT EXISTS escrow_deals (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, funded, delivered, released, disputed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. IDK SHOP (Marketplace)
CREATE TABLE IF NOT EXISTS shop_products (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shop_orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  buyer_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'paid',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. IDK SQUARE (Anuncios y Revenue Share)
CREATE TABLE IF NOT EXISTS ads_campaigns (
  id TEXT PRIMARY KEY,
  advertiser_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  budget REAL NOT NULL,
  spent REAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ads_revenue_share (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  amount REAL NOT NULL,
  week_date DATE NOT NULL
);

-- 4. TRUST SCORE EVENTS (Historial de Reputación)
CREATE TABLE IF NOT EXISTS trust_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- kyc_verified, social_connected, deal_completed
  points INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. DEVELOPER API KEYS (B2B)
CREATE TABLE IF NOT EXISTS developer_api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  requests_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
