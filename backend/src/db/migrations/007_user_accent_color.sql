-- ============================================================
-- 007_user_accent_color.sql
-- Color de acento personalizable por el usuario
-- Paleta curada IDKFREE: 10 colores
-- ============================================================

ALTER TABLE users ADD COLUMN accent_color TEXT NOT NULL DEFAULT 'blanco'
  CHECK (accent_color IN (
    'blanco','negro','rojo','azul','verde',
    'dorado','violeta','coral','menta','mostaza'
  ));
