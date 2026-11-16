-- Tema de texto para el flyer (light o dark)
ALTER TABLE events ADD COLUMN text_theme TEXT DEFAULT 'light';

-- Categoría del evento (Musical, Deportivo, Teatro, etc.)
ALTER TABLE events ADD COLUMN category TEXT DEFAULT 'general';

-- Métodos de pago habilitados (QvaPay, Efectivo, EnZona)
ALTER TABLE events ADD COLUMN payment_methods TEXT DEFAULT '["qvapay"]';
