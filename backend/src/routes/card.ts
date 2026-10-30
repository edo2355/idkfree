// card.ts - Carnet digital del usuario (v3) — cifrado en reposo
import type { FastifyInstance } from "fastify";
import { requireAuth } from "../middleware/auth.js";
import { requireAlive } from "../middleware/requireAlive.js";
import { query } from "../db/pool.js";
import { decryptSecret } from "../crypto/cardSecrets.js";

function maskPin(pin: string): string {
  if (!pin) return "••••";
  return pin.slice(0, 2) + "••";
}

// Prefiere el secret cifrado (*_enc) con fallback al plano (legacy).
// Si decryptSecret falla (por rotación de CARD_SECRET o corrupción),
// cae al plano para no romper al usuario.
function getSecret(row: any, field: string): string | null {
  const enc = row[field + "_enc"];
  if (enc) {
    try { return decryptSecret(enc); } catch { /* fallback */ }
  }
  const plain = row[field];
  return plain ?? null;
}

export async function cardRoutes(app: FastifyInstance) {
  app.get("/me/card", { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const userId = (req as any).userId;

    const cardRes = await query<any>(
      `SELECT card_id,
              secret_panic, secret_restore, secret_fenix,
              secret_panic_enc, secret_restore_enc, secret_fenix_enc,
              backup_panic, backup_restore, backup_fenix,
              backup_panic_enc, backup_restore_enc, backup_fenix_enc,
              created_at
       FROM card_keys WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    const row = cardRes.rows[0];

    const userRes = await query<any>(
      "SELECT id, alias, name, avatar_url, created_at FROM users WHERE id = $1 LIMIT 1",
      [userId]
    );
    const user = userRes.rows[0];

    if (!row || !user) {
      return reply.status(404).send({ error: "Carnet no encontrado" });
    }

    const hex = row.card_id.replace(/-/g, "").slice(0, 8).toUpperCase();
    const cardIdShort = `IDK-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;

    const panic = getSecret(row, "secret_panic");
    const restore = getSecret(row, "secret_restore");
    const fenix = getSecret(row, "secret_fenix");
    const bPanic = getSecret(row, "backup_panic");
    const bRestore = getSecret(row, "backup_restore");
    const bFenix = getSecret(row, "backup_fenix");

    return reply.send({
      card: {
        cardId: row.card_id,
        cardIdShort,
        createdAt: row.created_at,
        ownerId: user.id,
        alias: user.alias,
        name: user.name,
        avatar_url: user.avatar_url,
        qrPayloads: {
          panic: panic ? `aldea:v1:${row.card_id}:panic:${panic}` : null,
          restore: restore ? `aldea:v1:${row.card_id}:restore:${restore}` : null,
          fenix: fenix ? `aldea:v1:${row.card_id}:fenix:${fenix}` : null,
        },
        backupCodes: {
          panic: bPanic ?? null,
          restore: bRestore ?? null,
          fenix: bFenix ?? null,
        },
        pinsMasked: {
          panic: "••••",
          recovery: "••••",
          destroy: "••••",
        },
      },
    });
  });
}
