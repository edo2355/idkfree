-- Para eventos: marcar cuándo se actualizó (Sin CURRENT_TIMESTAMP por restricción de ALTER TABLE)
ALTER TABLE events ADD COLUMN updated_at DATETIME;

-- Para catálogo: ampliar tabla shop_products para soportar features Pro
ALTER TABLE shop_products ADD COLUMN category TEXT DEFAULT 'general';
ALTER TABLE shop_products ADD COLUMN product_type TEXT DEFAULT 'physical'; -- physical, digital, service
ALTER TABLE shop_products ADD COLUMN is_featured INTEGER DEFAULT 0;
ALTER TABLE shop_products ADD COLUMN discount_price REAL;
