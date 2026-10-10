import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';
import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
try { mkdirSync(UPLOAD_DIR, { recursive: true }); } catch {}

const ALLOWED_MIME = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime',
];

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/uploads', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const data = await req.file({ limits: { fileSize: MAX_SIZE } });
    if (!data) return reply.code(400).send({ error: 'Sin archivo' });

    if (!ALLOWED_MIME.includes(data.mimetype)) {
      return reply.code(415).send({ error: 'Tipo de archivo no permitido' });
    }

    const ext = data.filename.split('.').pop() ?? 'bin';
    const id = randomUUID();
    const filename = `${id}.${ext}`;
    const filepath = join(UPLOAD_DIR, filename);

    try {
      await pipeline(data.file, createWriteStream(filepath));
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error guardando archivo' });
    }

    // URL pública relativa. El cliente la convierte a URL absoluta.
    const url = `/uploads/${filename}`;
    return reply.code(201).send({
      id,
      url,
      mime: data.mimetype,
      size: data.file.bytesRead,
    });
  });
}
