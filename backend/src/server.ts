import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './config/env.js';
import { authRoutes } from './routes/auth.js';
import { postRoutes } from './routes/posts.js';
import { storyRoutes } from './routes/stories.js';
import { repostRoutes } from './routes/reposts.js';
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
import { uploadRoutes } from './routes/uploads.js';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { pool } from './db/pool.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(jwt, { secret: env.jwtSecret });
await app.register(multipart, { limits: { fileSize: 25 * 1024 * 1024 } });
await app.register(fastifyStatic, { root: join(process.cwd(), 'uploads'), prefix: '/uploads/' });

await app.register(authRoutes, { prefix: '/api' });
await app.register(postRoutes, { prefix: '/api' });
  app.register(storyRoutes, { prefix: '/api' });
  app.register(repostRoutes, { prefix: '/api' });
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
await app.register(messageRoutes, { prefix: '/api' });
await app.register(uploadRoutes, { prefix: '/api' });

app.get('/health', async () => ({ status: 'ok', version: '2.0', time: new Date().toISOString() }));

try {
  await app.listen({ port: env.port, host: '0.0.0.0' });
  console.log(`OK Aldea v2.0 escuchando en el puerto ${env.port}`);
} catch (err) { app.log.error(err); process.exit(1); }

process.on('SIGTERM', async () => { await app.close(); await pool.end(); process.exit(0); });
