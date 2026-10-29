-- Migration 024: Feed de Oportunidades (Cross-Border Pivot)

-- Añadir campos a la tabla posts existente
ALTER TABLE posts ADD COLUMN type TEXT NOT NULL DEFAULT 'social';
ALTER TABLE posts ADD COLUMN request_data TEXT; -- JSON con detalles (precio, cantidad, país)
ALTER TABLE posts ADD COLUMN action_type TEXT;  -- 'comprar', 'contratar', 'ofrecer', 'pedir'
ALTER TABLE posts ADD COLUMN catalog_item_id TEXT; -- Vinculación con el catálogo si aplica

-- Crear índices para que el feed vuele
CREATE INDEX IF NOT EXISTS idx_posts_type_created ON posts(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_action ON posts(action_type, created_at DESC) WHERE action_type IS NOT NULL;
