// card.ts - Carnet digital del usuario (v3)
import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';
import { query } from '../db/pool.js';

function maskPin(pin: string): string {
  if (!pin) return '••••';
  return pin.slice(0, 2) + '••';
}

export async function cardRoutes(app: FastifyInstance) {
  app.get('/me/card', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const userId = (req as any).userId;

    const cardRes = await query<any>(
      'SELECT card_id, secret_panic, secret_restore, secret_fenix, backup_panic, backup_restore, backup_fenix, created_at FROM card_keys WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    const row = cardRes.rows[0];

    const userRes = await query<any>(
      'SELECT id, alias, name, avatar_url, created_at FROM users WHERE id = $1 LIMIT 1',
      [userId]
    );
    const user = userRes.rows[0];

    if (!row || !user) {
      return reply.status(404).send({ error: 'Carnet no encontrado' });
    }

    // Derivar cardIdShort del cardId: primeros 8 hex chars → IDK-XXXX-XXXX
    const hex = row.card_id.replace(/-/g, '').slice(0, 8).toUpperCase();
    const cardIdShort = `IDK-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;

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
          panic: row.secret_panic ? `aldea:v1:${row.card_id}:panic:${row.secret_panic}` : null,
          restore: row.secret_restore ? `aldea:v1:${row.card_id}:restore:${row.secret_restore}` : null,
          fenix: row.secret_fenix ? `aldea:v1:${row.card_id}:fenix:${row.secret_fenix}` : null,
        },
        // Códigos impresos de respaldo (alternativa al PIN mental si se olvida)
        backupCodes: {
          panic: row.backup_panic ?? null,
          restore: row.backup_restore ?? null,
          fenix: row.backup_fenix ?? null,
        },
        // PINs enmascarados — la versión completa solo se devuelve en register
        pinsMasked: {
          panic: '••••',
          recovery: '••••',
          destroy: '••••',
        },
      },
    });
  });
}
