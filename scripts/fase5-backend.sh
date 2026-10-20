#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 5 parte 1 — Backend repost + drawings"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Migración 014_reposts ----------
echo "▸ 1. Migración 014_reposts.sql"
cat > backend/src/db/migrations/014_reposts.sql << 'SQL'
-- ============================================================
-- 014_reposts.sql — Republicar posts + dibujos (ya existe drawn_posts en 013)
-- ============================================================

-- Añadir columnas a posts para reposts
ALTER TABLE posts ADD COLUMN original_post_id TEXT REFERENCES posts(id);
ALTER TABLE posts ADD COLUMN is_repost INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_posts_original ON posts(original_post_id);
SQL
echo "  ✅ 014_reposts.sql"

# ---------- 2. Servicio repostService ----------
echo "▸ 2. repostService.ts"
cat > backend/src/services/repostService.ts << 'TS'
// ============================================================
// repostService.ts — Republicar posts + dibujos
// ============================================================
import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

function uuid() { return randomUUID(); }

export async function repostPost(userId: string, originalPostId: string, body?: string) {
  // Verificar que el original existe y es visible
  const orig = await query<any>(
    `SELECT id, author_id, visibility FROM posts WHERE id = $1 AND deleted_at IS NULL`,
    [originalPostId]
  );
  if (!orig.rows[0]) throw new Error('POST_NOT_FOUND');

  const id = uuid();
  await query(
    `INSERT INTO posts (id, author_id, body, image_url, video_url, visibility, is_repost, original_post_id)
     VALUES ($1, $2, $3, NULL, NULL, $4, 1, $5)`,
    [id, userId, body ?? null, orig.rows[0].visibility, originalPostId]
  );

  return { id };
}

export async function getDrawings(postId: string) {
  const res = await query<any>(
    `SELECT d.id, d.post_id, d.author_id, d.drawing_url, d.created_at,
            u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
     FROM drawn_posts d
     JOIN users u ON u.id = d.author_id
     WHERE d.post_id = $1 AND d.deleted_at IS NULL
     ORDER BY d.created_at DESC`,
    [postId]
  );
  return { drawings: res.rows };
}

export async function createDrawing(userId: string, postId: string, drawingUrl: string) {
  // Verificar que el post existe
  const p = await query<any>(
    `SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL`,
    [postId]
  );
  if (!p.rows[0]) throw new Error('POST_NOT_FOUND');

  const id = uuid();
  await query(
    `INSERT INTO drawn_posts (id, post_id, author_id, drawing_url)
     VALUES ($1, $2, $3, $4)`,
    [id, postId, userId, drawingUrl]
  );
  return { id };
}

export async function deleteDrawing(userId: string, drawingId: string) {
  const res = await query(
    `UPDATE drawn_posts SET deleted_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
    [drawingId, userId]
  );
  return (res as any).changes > 0;
}
TS
echo "  ✅ repostService.ts"

# ---------- 3. Rutas ----------
echo "▸ 3. routes/reposts.ts"
cat > backend/src/routes/reposts.ts << 'TS'
// ============================================================
// reposts.ts — Republicar + dibujos sobre posts
// ============================================================
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { repostPost, getDrawings, createDrawing, deleteDrawing } from '../services/repostService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const repostSchema = z.object({
  body: z.string().max(500).nullable().optional(),
});

const drawingSchema = z.object({
  drawingUrl: z.string().max(500),
});

export async function repostRoutes(app: FastifyInstance) {
  // POST /api/posts/:id/repost
  app.post('/posts/:id/repost', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = repostSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await repostPost(req.userId!, id, parsed.data.body ?? undefined);
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'POST_NOT_FOUND') return reply.code(404).send({ error: 'Post no encontrado' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/posts/:id/drawings
  app.get('/posts/:id/drawings', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const result = await getDrawings(id);
      return reply.send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/posts/:id/drawings
  app.post('/posts/:id/drawings', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = drawingSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await createDrawing(req.userId!, id, parsed.data.drawingUrl);
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err.message === 'POST_NOT_FOUND') return reply.code(404).send({ error: 'Post no encontrado' });
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/drawings/:id
  app.delete('/drawings/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const ok = await deleteDrawing(req.userId!, id);
      return reply.send({ ok });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
TS
echo "  ✅ routes/reposts.ts"

# ---------- 4. Registrar en server.ts ----------
echo "▸ 4. Registrar en server.ts"
python3 << 'PY'
path = 'backend/src/server.ts'
src = open(path).read()

if 'repostRoutes' not in src:
    # Import
    if 'storyRoutes' in src:
        src = src.replace(
            "import { storyRoutes } from './routes/stories.js';",
            "import { storyRoutes } from './routes/stories.js';\nimport { repostRoutes } from './routes/reposts.js';",
            1
        )
    else:
        # Insertar tras última línea de import
        import re
        matches = list(re.finditer(r"import \{[^}]+\} from '\./routes/[^']+';", src))
        if matches:
            last = matches[-1]
            src = src[:last.end()] + "\nimport { repostRoutes } from './routes/reposts.js';" + src[last.end():]

    # Register
    import re
    m = re.search(r"(app\.register\(storyRoutes[^;]+;)", src)
    if m:
        src = src.replace(m.group(1), m.group(1) + "\n  app.register(repostRoutes, { prefix: '/api' });", 1)
        print("  ✅ repostRoutes registrado")
    else:
        print("  ⚠️  no encontré app.register(storyRoutes) — revisar manualmente")

open(path, 'w').write(src)
PY

# ---------- 5. Cliente API ----------
echo ""
echo "▸ 5. Cliente API repost + drawings"
python3 << 'PY'
path = 'shared/api/client.ts'
src = open(path).read()

if 'repost:' not in src:
    # Añadir métodos al bloque posts
    old = """      delete: (id: string) => request<any>(`/posts/${id}`, { method: 'DELETE' }),"""
    new = """      delete: (id: string) => request<any>(`/posts/${id}`, { method: 'DELETE' }),
      repost: (id: string, body?: string) => request<any>(`/posts/${id}/repost`, { method: 'POST', body: JSON.stringify({ body: body ?? null }) }),
      drawings: (id: string) => request<any>(`/posts/${id}/drawings`),
      draw: (id: string, drawingUrl: string) => request<any>(`/posts/${id}/drawings`, { method: 'POST', body: JSON.stringify({ drawingUrl }) }),
      deleteDrawing: (id: string) => request<any>(`/drawings/${id}`, { method: 'DELETE' }),"""
    if old in src:
        src = src.replace(old, new, 1)
        open(path, 'w').write(src)
        print("  ✅ api.posts.repost + drawings")
    else:
        print("  ⚠️  patrón delete no encontrado")
else:
    print("  ·  ya existe")
PY

# Copiar a mobile
cp shared/api/client.ts mobile/shared/api/client.ts 2>/dev/null

# ---------- 6. Compilar + migrar backend ----------
echo ""
echo "▸ 6. Compilar backend + migrar"
cd backend
npx tsc 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC backend limpio"
  mkdir -p dist/db/migrations && cp src/db/migrations/*.sql dist/db/migrations/
  node dist/db/migrate.js 2>&1 | tail -3
  pkill -f "dist/server.js"; sleep 2
  nohup node dist/server.js > server.log 2>&1 &
  sleep 4
  curl -s -m 2 http://127.0.0.1:3000/health >/dev/null && echo "  ✅ backend arriba"
else
  echo "  ❌ TSC backend con errores"
fi
cd ..

# ---------- 7. Typecheck mobile ----------
echo ""
echo "▸ 7. Typecheck mobile"
cd mobile
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ mobile TSC limpio"
  TSC_OK=1
else
  echo "  ❌ mobile TSC con errores"
  TSC_OK=0
fi
cd ..

# ---------- 8. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 8. Commit + push"
  git add -A
  git commit -m "feat(repost): backend republicar + dibujos (migración 014 + servicio + rutas + client)" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 5 BACKEND LISTO"
echo "════════════════════════════════════════════════════"
