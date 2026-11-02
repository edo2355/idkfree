-- Agregar columnas a la tabla users
ALTER TABLE users ADD COLUMN birthdate TEXT;
ALTER TABLE users ADD COLUMN is_minor INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN parent_email TEXT;
ALTER TABLE users ADD COLUMN parent_token TEXT;
ALTER TABLE users ADD COLUMN parent_verified INTEGER DEFAULT 0;

-- Índice para acelerar el filtro del feed
CREATE INDEX idx_users_is_minor ON users(is_minor);
