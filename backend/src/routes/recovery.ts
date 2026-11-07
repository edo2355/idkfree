import { query } from '../db/pool.js';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { panicRecover, restoreRecover, fenixRecover, overridePendingDeletion, getRecoveryAudit, verifyCardSecrets } from '../services/recoveryService.js';
import { migrateAccount } from '../services/fenixMigrationService.js';
import { requireAuth } from '../middleware/auth.js';

const baseSchema = z.object({
  cardId: z.string().uuid(),
  secret: z.string().min(10),
  pin: z.string().regex(/^\d{4,8}$/),
});

const restoreSchema = baseSchema.extend({
  newPassword: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/),
});

export async function recoveryRoutes(app: FastifyInstance) {
  // POST /api/auth/recover/panic — bloquea la cuenta temporalmente
  app.post('/auth/recover/panic', async (req, reply) => {
    const parsed = baseSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const res = await panicRecover(parsed.data);
      return reply.send(res);
    } catch (err: any) {
      if (err.message === 'INVALID_CARD' || err.message === 'INVALID_QR' || err.message === 'INVALID_PIN') {
        return reply.code(401).send({ error: 'Carnet, QR o PIN incorrectos' });
      }
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/auth/recover/restore — cambia la contraseña
  app.post('/auth/recover/restore', async (req, reply) => {
    const parsed = restoreSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const res = await restoreRecover(parsed.data);
      return reply.send(res);
    } catch (err: any) {
      if (err.message === 'INVALID_CARD' || err.message === 'INVALID_QR' || err.message === 'INVALID_PIN') {
        return reply.code(401).send({ error: 'Carnet, QR o PIN incorrectos' });
      }
      if (err.message === 'WEAK_PASSWORD') return reply.code(400).send({ error: 'Contraseña muy débil' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/auth/recover/fenix — borra la cuenta
  app.post('/auth/recover/fenix', async (req, reply) => {
    const parsed = baseSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    try {
      const res = await fenixRecover(parsed.data);
      return reply.send(res);
    } catch (err: any) {
      if (err.message === 'INVALID_CARD' || err.message === 'INVALID_QR' || err.message === 'INVALID_PIN') {
        return reply.code(401).send({ error: 'Carnet, QR o PIN incorrectos' });
      }
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });


  // POST /api/auth/recover/fenix/migrate — Migra los datos a una nueva cuenta segura
  app.post('/auth/recover/fenix/migrate', async (req, reply) => {
    const schema = baseSchema.extend({
      newEmail: z.string().email(),
      newPassword: z.string().min(12),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos' });

    try {
      // Verificamos primero que el carnet y PIN Fénix sean válidos
      const { userId } = await verifyCardSecrets('fenix', parsed.data);
      
      // Ejecutamos la migración
      const result = await migrateAccount(userId, parsed.data.newEmail, parsed.data.newPassword);
      return reply.send(result);
    } catch (err: any) {
      if (err.message === 'INVALID_CARD' || err.message === 'INVALID_PIN') return reply.code(401).send({ error: 'Carnet o PIN inválidos' });
      if (err.message === 'EMAIL_TAKEN') return reply.code(400).send({ error: 'El nuevo email ya está en uso' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al migrar la cuenta' });
    }
  });

  // POST /api/recovery/override — dueño revierte acción hecha con código impreso
  app.post('/recovery/override', { preHandler: [requireAuth] }, async (req, reply) => {
    const { cardId, pin } = req.body as { cardId?: string; pin?: string };
    if (!cardId || !pin) {
      return reply.code(400).send({ error: 'cardId y pin requeridos' });
    }
    try {
      const ip = (req.headers['x-forwarded-for'] as string) ?? req.ip;
      const result = await overridePendingDeletion(cardId, pin, ip);
      return reply.send(result);
    } catch (err: any) {
      const code = err.message === 'INVALID_MENTAL_PIN' ? 401
        : err.message === 'INVALID_CARD' ? 404
        : 500;
      return reply.code(code).send({ error: err.message });
    }
  });

  // GET /api/recovery/audit/:cardId — historial de intentos del carnet
  app.get('/recovery/audit/:cardId', { preHandler: [requireAuth] }, async (req, reply) => {
    const { cardId } = req.params as { cardId: string };
    try {
      const audit = await getRecoveryAudit(cardId, 50);
      return reply.send({ audit });
    } catch (err: any) {
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}

// ⚠️ TEMPORAL: Endpoint de debug para verificar el estado de un carnet
app.get('/debug/card/:cardId', async (req, reply) => {
  const { cardId } = req.params as { cardId: string };
  try {
    const res = await query(
      `SELECT 
        card_id,
        CASE WHEN secret_panic IS NULL THEN 'NULL' ELSE 'OK' END AS panic_text,
        CASE WHEN secret_panic_enc IS NULL THEN 'NULL' ELSE 'OK' END AS panic_enc,
        CASE WHEN secret_restore IS NULL THEN 'NULL' ELSE 'OK' END AS restore_text,
        CASE WHEN secret_restore_enc IS NULL THEN 'NULL' ELSE 'OK' END AS restore_enc,
        LENGTH(secret_restore_enc) AS enc_len
       FROM card_keys WHERE card_id = $1`,
      [cardId]
    );
    return reply.send(res.rows[0] || { error: 'No encontrado' });
  } catch (err: any) {
    return reply.code(500).send({ error: err.message });
  }
});

// ⚠️ TEMPORAL: Debug completo del carnet
app.get('/debug/card/:cardId', async (req, reply) => {
  const { cardId } = req.params as { cardId: string };
  const { pin, kind = 'restore' } = req.query as any;
  const bcrypt = await import('bcryptjs');
  const { decryptSecret } = await import('../crypto/cardSecrets.js');
  
  try {
    const secretCol = `secret_${kind}`;
    const pinCol = kind === 'panic' ? 'pin_panic_hash' : kind === 'restore' ? 'pin_recovery_hash' : 'pin_destroy_hash';
    
    const res = await query(
      `SELECT 
        card_id,
        ${secretCol} AS secret_plain,
        ${secretCol}_enc AS secret_enc,
        ${pinCol} AS pin_hash
       FROM card_keys WHERE card_id = $1`,
      [cardId]
    );
    
    if (res.rows.length === 0) return reply.send({ error: 'No encontrado' });
    const row: any = res.rows[0];
    
    // Analizar secret
    let secretDecrypted = null;
    let secretDecryptError = null;
    if (row.secret_enc) {
      try {
        secretDecrypted = decryptSecret(row.secret_enc);
      } catch (e: any) {
        secretDecryptError = e.message;
      }
    }
    
    // Analizar PIN
    let pinOk = null;
    let pinError = null;
    if (pin && row.pin_hash) {
      try {
        const hashStr = Buffer.isBuffer(row.pin_hash) ? row.pin_hash.toString('utf-8') : String(row.pin_hash);
        pinOk = await bcrypt.default.compare(String(pin), hashStr);
      } catch (e: any) {
        pinError = e.message;
      }
    }
    
    return reply.send({
      card_id: row.card_id,
      secret_plain: row.secret_plain,
      secret_enc_exists: !!row.secret_enc,
      secret_enc_length: row.secret_enc ? Buffer.from(row.secret_enc).length : 0,
      secret_decrypted: secretDecrypted,
      secret_decrypt_error: secretDecryptError,
      pin_hash_exists: !!row.pin_hash,
      pin_hash_type: typeof row.pin_hash,
      pin_hash_is_buffer: Buffer.isBuffer(row.pin_hash),
      pin_comparison: pinOk,
      pin_error: pinError,
    });
  } catch (err: any) {
    return reply.code(500).send({ error: err.message });
  }
});
