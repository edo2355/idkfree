-- Eliminar restricción UNIQUE de la columna email para permitir hasta 5 cuentas
PRAGMA foreign_keys=OFF;

CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  alias TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  accent_color TEXT NOT NULL DEFAULT 'blanco' CHECK (accent_color IN ('blanco','negro','rojo','azul','verde','dorado','violeta','coral','menta','mostaza')),
  legacy_mode INTEGER NOT NULL DEFAULT 0 CHECK (legacy_mode IN (0, 1)),
  legacy_message TEXT CHECK (legacy_message IS NULL OR length(legacy_message) <= 500),
  legacy_activated_at TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  account_type TEXT DEFAULT 'personal',
  category TEXT,
  links TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  phone_number TEXT,
  email_verified BOOLEAN DEFAULT FALSE
);

INSERT INTO users_new 
SELECT id, email, alias, password_hash, name, bio, avatar_url, created_at, deleted_at, accent_color, legacy_mode, legacy_message, legacy_activated_at, phone, role, account_type, category, links, is_locked, phone_number, email_verified 
FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;
PRAGMA foreign_keys=ON;
