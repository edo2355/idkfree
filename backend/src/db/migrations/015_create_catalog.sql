CREATE TABLE IF NOT EXISTS catalog_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  type TEXT DEFAULT 'product',
  image_url TEXT,
  status TEXT DEFAULT 'active',
  category TEXT DEFAULT 'General',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);