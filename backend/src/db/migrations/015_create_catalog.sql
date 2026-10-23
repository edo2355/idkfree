CREATE TABLE IF NOT EXISTS catalog_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  type TEXT DEFAULT 'product', -- 'product' o 'service'
  image_url TEXT,
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'active', -- 'active', 'sold', 'paused'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
