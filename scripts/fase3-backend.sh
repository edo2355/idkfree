#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 3 — Backend Historias 24h"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Migración ----------
echo "▸ 1. Migración 013_stories.sql"
cat > backend/src/db/migrations/013_stories.sql << 'SQL'
-- ============================================================
-- 013_stories.sql — Historias 24h + dibujos sobre posts
-- ============================================================

-- Historias (expiran a las 24h)
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES users(id),
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image','video')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_stories_author ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON stories(expires_at);

-- Vistas de historias (quién vio qué)
CREATE TABLE IF NOT EXISTS story_views (
  story_id TEXT NOT NULL REFERENCES stories(id),
  viewer_id TEXT NOT NULL REFERENCES users(id),
  viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (story_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS idx_story_views_story ON story_views(story_id);

-- Dibujos sobre posts (bromas)
CREATE TABLE IF NOT EXISTS drawn_posts (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  drawing_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_drawn_posts_post ON drawn_posts(post_id);
SQL
echo "  ✅ 013_stories.sql creado"

# ---------- 2. Tipos ----------
echo ""
echo "▸ 2. Tipos Story + StoryView"
python3 << 'PY'
path = 'shared/types/index.ts'
src = open(path).read()

if 'interface Story' not in src:
    addition = '''

export interface Story {
  id: string;
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  expires_at: string;
  viewers_count?: number;
  viewed_by_me?: boolean;
}

export interface StoryGroup {
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  stories: Story[];
  all_viewed: boolean;
}

export interface DrawnPost {
  id: string;
  post_id: string;
  author_id: string;
  author_alias: string;
  drawing_url: string;
  created_at: string;
}
'''
    open(path, 'a').write(addition)
    print("  ✅ Story + StoryGroup + DrawnPost añadidos")
else:
    print("  ·  ya existen")
PY

# Sincronizar copia mobile
cp shared/types/index.ts mobile/shared/types/index.ts 2>/dev/null

# ---------- 3. Cliente API ----------
echo ""
echo "▸ 3. Cliente API stories.*"
python3 << 'PY'
path = 'shared/api/client.ts'
src = open(path).read()

if 'api.stories' not in src and 'stories: {' not in src:
    # Insertar bloque stories antes de "bookmarks:" o antes de "recovery:"
    insertion = '''    stories: {
      create: (d: { mediaUrl: string; mediaType: 'image' | 'video' }) =>
        request<any>('/stories', { method: 'POST', body: JSON.stringify(d) }),
      feed: () => request<any>('/stories/feed'),
      delete: (id: string) => request<any>(`/stories/${id}`, { method: 'DELETE' }),
    },
'''
    if '    bookmarks: {' in src:
        src = src.replace('    bookmarks: {', insertion + '    bookmarks: {', 1)
    elif '    recovery: {' in src:
        src = src.replace('    recovery: {', insertion + '    recovery: {', 1)
    else:
        # fallback: antes del cierre final de createApi
        src = src.replace('  };\n}\n\nexport type ApiClient', '    ' + insertion + '  };\n}\n\nexport type ApiClient', 1)
    open(path, 'w').write(src)
    print("  ✅ api.stories añadido")
else:
    print("  ·  ya existe")
PY

# Sincronizar copia mobile
cp shared/api/client.ts mobile/shared/api/client.ts 2>/dev/null

# ---------- 4. Servicio backend ----------
echo ""
echo "▸ 4. storiesService.ts"
cat > backend/src/services/storiesService.ts << 'TS'
// ============================================================
// storiesService.ts — Historias 24h
// ============================================================
import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

function uuid() { return randomUUID(); }

export async function createStory(
  authorId: string,
  data: { mediaUrl: string; mediaType: 'image' | 'video' }
) {
  const id = uuid();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await query(
    `INSERT INTO stories (id, author_id, media_url, media_type, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, authorId, data.mediaUrl, data.mediaType, expiresAt]
  );

  return { id, expires_at: expiresAt };
}

export async function getStoriesFeed(viewerId: string) {
  // Trae historias no expiradas de:
  //  1. El propio viewer
  //  2. Usuarios que sigue
  // Agrupadas por autor.
  const res = await query<any>(
    `SELECT s.id, s.author_id, s.media_url, s.media_type, s.created_at, s.expires_at,
            u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar,
            (SELECT COUNT(*) FROM story_views sv WHERE sv.story_id = s.id) AS viewers_count,
            EXISTS(SELECT 1 FROM story_views sv WHERE sv.story_id = s.id AND sv.viewer_id = $1) AS viewed_by_me
     FROM stories s
     JOIN users u ON u.id = s.author_id
     WHERE s.deleted_at IS NULL
       AND s.expires_at > datetime('now')
       AND (s.author_id = $1
            OR s.author_id IN (SELECT followed_id FROM follows WHERE follower_id = $1))
     ORDER BY s.created_at DESC`,
    [viewerId]
  );

  // Agrupar por autor
  const groups: Record<string, any> = {};
  for (const row of res.rows) {
    if (!groups[row.author_id]) {
      groups[row.author_id] = {
        author_id: row.author_id,
        author_alias: row.author_alias,
        author_name: row.author_name,
        author_avatar: row.author_avatar,
        stories: [],
        all_viewed: true,
      };
    }
    groups[row.author_id].stories.push({
      id: row.id,
      author_id: row.author_id,
      author_alias: row.author_alias,
      author_name: row.author_name,
      author_avatar: row.author_avatar,
      media_url: row.media_url,
      media_type: row.media_type,
      created_at: row.created_at,
      expires_at: row.expires_at,
      viewers_count: Number(row.viewers_count),
      viewed_by_me: !!row.viewed_by_me,
    });
    if (!row.viewed_by_me) groups[row.author_id].all_viewed = false;
  }

  // Propio viewer primero, luego resto
  const list = Object.values(groups).sort((a: any, b: any) => {
    if (a.author_id === viewerId) return -1;
    if (b.author_id === viewerId) return 1;
    return 0;
  });

  return { stories: list };
}

export async function getStoryById(id: string, viewerId: string) {
  const res = await query<any>(
    `SELECT s.*, u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
     FROM stories s
     JOIN users u ON u.id = s.author_id
     WHERE s.id = $1 AND s.deleted_at IS NULL AND s.expires_at > datetime('now')`,
    [id]
  );
  const story = res.rows[0];
  if (!story) return null;

  // Marcar como vista
  await query(
    `INSERT OR IGNORE INTO story_views (story_id, viewer_id) VALUES ($1, $2)`,
    [id, viewerId]
  );

  return {
    id: story.id,
    author_id: story.author_id,
    author_alias: story.author_alias,
    author_name: story.author_name,
    author_avatar: story.author_avatar,
    media_url: story.media_url,
    media_type: story.media_type,
    created_at: story.created_at,
    expires_at: story.expires_at,
  };
}

export async function deleteStory(id: string, userId: string) {
  const res = await query(
    `UPDATE stories SET deleted_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
    [id, userId]
  );
  return (res as any).changes > 0 || res.rows?.length > 0;
}
TS
echo "  ✅ storiesService.ts creado"

# ---------- 5. Rutas backend ----------
echo ""
echo "▸ 5. routes/stories.ts"
cat > backend/src/routes/stories.ts << 'TS'
// ============================================================
// stories.ts — Rutas HTTP de historias 24h
// ============================================================
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createStory, getStoriesFeed, getStoryById, deleteStory } from '../services/storiesService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const createStorySchema = z.object({
  mediaUrl: z.string().max(500),
  mediaType: z.enum(['image', 'video']),
});

export async function storyRoutes(app: FastifyInstance) {
  // POST /api/stories
  app.post('/stories', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const parsed = createStorySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await createStory(req.userId!, parsed.data);
      return reply.code(201).send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/stories/feed
  app.get('/stories/feed', { preHandler: [requireAuth] }, async (req, reply) => {
    try {
      const stories = await getStoriesFeed(req.userId!);
      return reply.send(stories);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/stories/:id
  app.get('/stories/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const story = await getStoryById(id, req.userId!);
      if (!story) return reply.code(404).send({ error: 'Historia no encontrada o expirada' });
      return reply.send({ story });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // DELETE /api/stories/:id
  app.delete('/stories/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const ok = await deleteStory(id, req.userId!);
      return reply.send({ ok });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
TS
echo "  ✅ routes/stories.ts creado"

# ---------- 6. Registro en server.ts ----------
echo ""
echo "▸ 6. Registrando en server.ts"
python3 << 'PY'
path = 'backend/src/server.ts'
src = open(path).read()

if 'storyRoutes' not in src:
    # Import
    if 'postRoutes' in src:
        src = src.replace(
            "import { postRoutes } from './routes/posts.js';",
            "import { postRoutes } from './routes/posts.js';\nimport { storyRoutes } from './routes/stories.js';",
            1
        )
    else:
        # Insertar tras el último import de rutas
        import re
        m = list(re.finditer(r"import \{[^}]+\} from '\./routes/[^']+';", src))
        if m:
            last = m[-1]
            src = src[:last.end()] + "\nimport { storyRoutes } from './routes/stories.js';" + src[last.end():]

    # Register
    if 'postRoutes' in src:
        # Encontrar la línea de app.register(postRoutes...)
        import re
        m = re.search(r"(app\.register\(postRoutes[^;]+;)", src)
        if m:
            src = src.replace(m.group(1), m.group(1) + "\n  app.register(storyRoutes, { prefix: '/api' });", 1)
            print("  ✅ storyRoutes registrado")
        else:
            print("  ⚠️  no encontré app.register(postRoutes...) — revisa server.ts manualmente")
    else:
        print("  ⚠️  no encontré postRoutes en server.ts")
else:
    print("  ·  ya registrado")

open(path, 'w').write(src)
PY

# ---------- 7. Recompilar + migrar ----------
echo ""
echo "▸ 7. Compilar backend + copiar migraciones"
cd backend
npx tsc 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ Backend TSC limpio"
  mkdir -p dist/db/migrations && cp src/db/migrations/*.sql dist/db/migrations/
  echo "  ✅ Migraciones copiadas"
  # Reiniciar
  pkill -f "dist/server.js"; sleep 2
  nohup node dist/server.js > server.log 2>&1 &
  sleep 4
  if curl -s -m 2 http://127.0.0.1:3000/health >/dev/null; then
    echo "  ✅ Backend reiniciado"
  else
    echo "  ❌ Backend no responde — mira server.log"
  fi
else
  echo "  ❌ Backend TSC con errores"
fi
cd ..

# ---------- 8. Typecheck mobile ----------
echo ""
echo "▸ 8. Typecheck mobile"
cd mobile
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then echo "  ✅ Mobile TSC limpio"; fi
cd ..

# ---------- 9. Commit ----------
echo ""
echo "▸ 9. Commit + push"
git add -A
git commit -m "feat(stories): backend historias 24h (migración + servicio + rutas + tipos + client)" 2>&1 | head -2
git push 2>&1 | tail -2

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 3 BACKEND LISTO"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Endpoints nuevos:"
echo "    POST   /api/stories"
echo "    GET    /api/stories/feed"
echo "    GET    /api/stories/:id"
echo "    DELETE /api/stories/:id"
echo ""
