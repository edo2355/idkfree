import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { env } from './config/env.js';
import { callRoutes } from './routes/calls.js';
import { logRoutes } from './routes/logs.js';
import { qvapayWebhookRoutes } from './routes/qvapayWebhook.js';
import { catalogRoutes } from './routes/catalog.js';
import { verificationRoutes } from './routes/verification.js';
import { authRoutes } from './routes/auth.js';
import { postRoutes } from './routes/posts.js';
import { storyRoutes } from './routes/stories.js';
import { repostRoutes } from './routes/reposts.js';
import { streamRoutes } from './routes/streams.js';
import { followRoutes } from './routes/follows.js';
import { commentRoutes } from './routes/comments.js';
import { notificationRoutes } from './routes/notifications.js';
import { profileRoutes } from './routes/profile.js';
import { searchRoutes } from './routes/search.js';
import { hashtagRoutes } from './routes/hashtags.js';
import { vibeRoutes } from './routes/vibes.js';
import { legacyRoutes } from './routes/legacy.js';
import { cardRoutes } from './routes/card.js';
import { recoveryRoutes } from './routes/recovery.js';
import { messageRoutes } from './routes/messages.js';
import { livekitRoutes } from './routes/livekit.js';
import { adminRoutes } from './routes/admin.js';
import { uploadRoutes } from './routes/uploads.js';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { pool } from './db/pool.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: ['http://localhost:5173', 'https://www.idkfreegetid.dpdns.org', 'https://idkfreegetid.dpdns.org'], credentials: true });
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({ error: 'Demasiadas peticiones. Intenta de nuevo en 1 minuto.' }),
});
await app.register(jwt, { secret: env.jwtSecret });

  // Decorador global para verificar el token JWT en las rutas
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

await app.register(multipart, { limits: { fileSize: 25 * 1024 * 1024 } });
await app.register(fastifyStatic, { root: join(process.cwd(), 'uploads'), prefix: '/uploads/' });

await app.register(callRoutes, { prefix: '/api' });
  app.register(logRoutes, { prefix: '/api' });
  app.register(authRoutes, { prefix: '/api' });
  app.register(verificationRoutes, { prefix: '/api' });
  app.register(catalogRoutes, { prefix: '/api' });
  app.register(qvapayWebhookRoutes, { prefix: '/api' });
await app.register(postRoutes, { prefix: '/api' });
  app.register(storyRoutes, { prefix: '/api' });
  app.register(repostRoutes, { prefix: '/api' });
  app.register(streamRoutes, { prefix: '/api' });
await app.register(followRoutes, { prefix: '/api' });
await app.register(commentRoutes, { prefix: '/api' });
await app.register(notificationRoutes, { prefix: '/api' });
await app.register(profileRoutes, { prefix: '/api' });
await app.register(searchRoutes, { prefix: '/api' });
await app.register(hashtagRoutes, { prefix: '/api' });
await app.register(vibeRoutes, { prefix: '/api' });
await app.register(legacyRoutes, { prefix: '/api' });
await app.register(cardRoutes, { prefix: '/api' });
await app.register(recoveryRoutes, { prefix: '/api' });
await app.register(adminRoutes, { prefix: '/api' });
  app.register(livekitRoutes, { prefix: '/api' });
  app.register(messageRoutes, { prefix: '/api' });
await app.register(uploadRoutes, { prefix: '/api' });

// Capturar tiempo de arranque para calcular uptime
const _startedAt = Date.now();

app.get('/health', async () => {
  const uptimeMs = Date.now() - _startedAt;
  return {
    status: 'ok',
    version: '2.0.0',
    time: new Date().toISOString(),
    db_engine: process.env.DB_ENGINE ?? 'sqlite',
    uptime_s: Math.floor(uptimeMs / 1000),
    node_version: process.version,
    env: process.env.NODE_ENV ?? 'development',
  };
});

try {
  // ============================================================
// CRON: Ejecutar borrado de cuentas FÉNIX pendientes (>24h)
// ============================================================
async function cleanupFenix() {
  try {
    const { query } = await import('./db/pool.js');
    const res = await query(
      `DELETE FROM users WHERE id IN (
        SELECT user_id FROM card_keys
        WHERE pending_deletion_at IS NOT NULL
          AND pending_deletion_at < datetime('now')
      )`
    );
    if ((res as any).changes > 0) {
      console.log(`[FENIX] ${(res as any).changes} cuenta(s) borrada(s) por vencimiento`);
    }
  } catch (e) {
    console.error('[FENIX] error en cron de limpieza:', e);
  }
}

// Primera ejecución: 5 min después del arranque
// Recurrente: cada 1 hora
setTimeout(() => {
  cleanupFenix();
  setInterval(cleanupFenix, 3600_000);
}, 5 * 60_000);

await app.listen({ port: env.port, host: '0.0.0.0' });
  console.log(`OK Aldea v2.0 escuchando en el puerto ${env.port}`);
} catch (err) { app.log.error(err); process.exit(1); }

process.on('SIGTERM', async () => { await app.close(); await pool.end(); process.exit(0); });
