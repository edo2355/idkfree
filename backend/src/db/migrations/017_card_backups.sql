-- ============================================================
-- 017_card_backups.sql — Backups impresos + ventana FÉNIX + audit
-- ============================================================

-- Backups impresos (visibles en carnet, alternativa al PIN mental)
ALTER TABLE card_keys ADD COLUMN backup_panic TEXT;
ALTER TABLE card_keys ADD COLUMN backup_restore TEXT;
ALTER TABLE card_keys ADD COLUMN backup_fenix TEXT;

-- Ventana de gracia para FÉNIX (24h para revertir con mental)
ALTER TABLE card_keys ADD COLUMN pending_deletion_at TEXT;
ALTER TABLE card_keys ADD COLUMN pending_deletion_kind TEXT;

-- Audit de intentos de recuperación
CREATE TABLE IF NOT EXISTS recovery_audit (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  action TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('mental','printed')),
  success INTEGER NOT NULL DEFAULT 0,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recovery_audit_card ON recovery_audit(card_id);
CREATE INDEX IF NOT EXISTS idx_recovery_audit_created ON recovery_audit(created_at);
