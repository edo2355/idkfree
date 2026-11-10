-- Añadir el puntaje directamente al usuario
ALTER TABLE users ADD COLUMN trust_score INTEGER DEFAULT 10;

-- Tabla de eventos (historial de por qué tiene ese puntaje)
CREATE TABLE IF NOT EXISTS trust_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'kyc_approved', 'telegram_linked', 'social_connected', 'deal_completed'
  points INTEGER NOT NULL,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
