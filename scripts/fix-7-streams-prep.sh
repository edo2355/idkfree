#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree || exit 1

echo "════════════════════════════════════════════════════"
echo "  Bloque 4/6 — Streams prep (arquitectura + tabla + UI)"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Documento de arquitectura ----------
echo "▸ 1. docs/STREAMS.md"
mkdir -p docs
cat > docs/STREAMS.md << 'MD'
# IDKFREE · Streams en vivo

## Decisión arquitectónica

**WebRTC + SFU (Selective Forwarding Unit)** — no P2P puro.

### ¿Por qué no P2P?
- P2P funciona para 1:1, pero con 20+ viewers la subida del streamer se satura
- Cuba tiene uploads limitados → P2P no escala

### ¿Por qué SFU?
- El streamer sube **1 vez** al servidor
- El servidor redistribuye a N viewers
- Compatible con móvil 3G/4G/WiFi
- Ya hay servidores open-source listos: **mediasoup**, **LiveKit**, **Janus**

### Recomendación: **LiveKit**
- Open source (Apache 2.0)
- SDK oficial para React Native
- Self-hosteable (corre en un VPS de $5/mes)
- Soporta audio, video, screen share, chat integrado
- WebRTC puro (sin plugins)

---

## Flujo técnico


1. Streamer → POST `/streams/start` → backend crea stream + room en LiveKit
2. Backend → devuelve `token` + `room_id`
3. Streamer se conecta a LiveKit con ese token
4. Viewers → GET `/streams/:id/join` → backend devuelve su token → se conectan

---

## Fases de implementación

### Fase 1 — UI + backend (AHORA)
- [x] Tabla `streams` en SQLite
- [x] Endpoints `/streams/start`, `/streams/active`, `/streams/:id`
- [x] Pantalla Streams (placeholder)
- [x] Botón "Iniciar stream" (sin conectar aún)

### Fase 2 — Dev build + LiveKit SDK
- [ ] Requiere **EAS Dev Build** (no funciona en Expo Go)
- [ ] `npm install @livekit/react-native @livekit/react-native-webrtc`
- [ ] Config nativa: permisos cámara/micrófono
- [ ] Configurar LiveKit en `app.json` (plugins nativos)

### Fase 3 — Streams funcionales
- [ ] Streamer: cámara frontal/trasera, mic on/off
- [ ] Viewer: reproductor fullscreen, chat lateral
- [ ] Señales (like, follow, report)
- [ ] Contador de viewers en vivo
- [ ] Modo "solo audio" para conexiones lentas

### Fase 4 — Escalado
- [ ] Deploy LiveKit a VPS (Hetzner, DigitalOcean)
- [ ] CDN para HLS fallback (viewer sin WebRTC)
- [ ] Grabación de streams (S3-compatible)

---

## Costos estimados

| Recurso | Costo |
|---|---|
| VPS LiveKit (2 vCPU, 4GB) | ~$12/mes |
| Ancho de banda (500 GB/mes) | ~$5-20/mes |
| **Total** | **~$20-35/mes** para 100-500 usuarios activos |

**Modo actual**: gratis (no hay streams activos).

---

## Requisitos para empezar Fase 2

1. **Expo SDK 54+** ✅ (ya lo tienes)
2. **EAS Dev Build** (bloquea Expo Go)
3. **Cuenta Expo** ✅
4. **Backend accesible desde internet** (para viewers externos)
5. **VPS LiveKit** o cuenta cloud (livekit.cloud)

---

## Riesgos conocidos

- **iOS/Android permisos**: la cámara en background NO funciona en iOS sin entitlements especiales
- **Conexiones lentas**: WebRTC adapta el bitrate, pero en 3G puede caer a 240p
- **VPNs**: algunas bloquean UDP → WebRTC cae a TCP (más lento)
- **Psiphon**: puede interferir con WebRTC. Testear con VPN apagada.

---

## Notas

- La app móvil actual (Expo Go) **NO puede** ejecutar WebRTC. Requiere Dev Build.
- La web (Vite) **SÍ puede** ejecutar WebRTC directamente.
- Prioridad futura: **web primero**, mobile después.
MD
echo "  ✅"

# ---------- 2. Migración: tabla streams ----------
echo "▸ 2. Migración 016_streams.sql"
cd backend
cat > src/db/migrations/016_streams.sql << 'SQL'
-- ============================================================
-- 016_streams.sql — Streams en vivo (preparación)
-- ============================================================

CREATE TABLE IF NOT EXISTS streams (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  room_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','live','ended')),
  viewers_count INTEGER NOT NULL DEFAULT 0,
  max_viewers INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  ended_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_streams_host ON streams(host_id);
CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status);
CREATE INDEX IF NOT EXISTS idx_streams_started ON streams(started_at);
SQL
echo "  ✅"

# ---------- 3. Servicio backend ----------
echo "▸ 3. streamService.ts"
cat > src/services/streamService.ts << 'TS'
// ============================================================
// streamService.ts — Streams en vivo (preparación)
// ============================================================
import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

function uuid() { return randomUUID(); }

export async function startStream(hostId: string, title: string, description?: string) {
  // Cerrar cualquier stream previo del host
  await query(
    `UPDATE streams SET status = 'ended', ended_at = CURRENT_TIMESTAMP
     WHERE host_id = $1 AND status IN ('pending','live')`,
    [hostId]
  );

  const id = uuid();
  const roomId = `idk-${id.slice(0, 8)}`;

  await query(
    `INSERT INTO streams (id, host_id, title, description, room_id, status, started_at)
     VALUES ($1, $2, $3, $4, $5, 'live', CURRENT_TIMESTAMP)`,
    [id, hostId, title, description ?? null, roomId]
  );

  return { id, roomId };
}

export async function endStream(hostId: string, streamId: string) {
  const res = await query(
    `UPDATE streams SET status = 'ended', ended_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND host_id = $2 AND status = 'live'`,
    [streamId, hostId]
  );
  return (res as any).changes > 0;
}

export async function getActiveStreams(viewerId: string, limit = 20) {
  const res = await query<any>(
    `SELECT s.id, s.host_id, s.title, s.description, s.room_id, s.status,
            s.viewers_count, s.max_viewers, s.started_at, s.created_at,
            u.alias AS host_alias, u.name AS host_name, u.avatar_url AS host_avatar
     FROM streams s
     JOIN users u ON u.id = s.host_id
     WHERE s.status = 'live' AND s.deleted_at IS NULL
     ORDER BY s.viewers_count DESC, s.started_at DESC
     LIMIT $1`,
    [limit]
  );
  return { streams: res.rows };
}

export async function getStream(id: string, viewerId: string) {
  const res = await query<any>(
    `SELECT s.id, s.host_id, s.title, s.description, s.room_id, s.status,
            s.viewers_count, s.max_viewers, s.started_at, s.ended_at, s.created_at,
            u.alias AS host_alias, u.name AS host_name, u.avatar_url AS host_avatar
     FROM streams s
     JOIN users u ON u.id = s.host_id
     WHERE s.id = $1 AND s.deleted_at IS NULL`,
    [id]
  );
  return res.rows[0] ?? null;
}
TS
echo "  ✅"

# ---------- 4. Rutas backend ----------
echo "▸ 4. routes/streams.ts"
cat > src/routes/streams.ts << 'TS'
// ============================================================
// streams.ts — Rutas HTTP de streams en vivo
// ============================================================
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { startStream, endStream, getActiveStreams, getStream } from '../services/streamService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAlive } from '../middleware/requireAlive.js';

const startSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).nullable().optional(),
});

export async function streamRoutes(app: FastifyInstance) {
  // POST /api/streams/start
  app.post('/streams/start', { preHandler: [requireAuth, requireAlive] }, async (req, reply) => {
    const parsed = startSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() });
    }
    try {
      const result = await startStream(req.userId!, parsed.data.title, parsed.data.description ?? undefined);
      return reply.code(201).send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // POST /api/streams/:id/end
  app.post('/streams/:id/end', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const ok = await endStream(req.userId!, id);
      return reply.send({ ok });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/streams/active
  app.get('/streams/active', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const result = await getActiveStreams(req.userId!, limit ? parseInt(limit) : 20);
      return reply.send(result);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/streams/:id
  app.get('/streams/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const stream = await getStream(id, req.userId!);
      if (!stream) return reply.code(404).send({ error: 'Stream no encontrado' });
      return reply.send({ stream });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
TS
echo "  ✅"

# ---------- 5. Registrar en server.ts ----------
echo "▸ 5. Registrar streamRoutes"
python3 << 'PY'
path = 'src/server.ts'
src = open(path).read()

if 'streamRoutes' not in src:
    src = src.replace(
        "import { repostRoutes } from './routes/reposts.js';",
        "import { repostRoutes } from './routes/reposts.js';\nimport { streamRoutes } from './routes/streams.js';",
        1
    )
    import re
    m = re.search(r"(app\.register\(repostRoutes[^;]+;)", src)
    if m:
        src = src.replace(m.group(1), m.group(1) + "\n  app.register(streamRoutes, { prefix: '/api' });", 1)
        print("  ✅ registrado")
    else:
        print("  ⚠️  no encontré repostRoutes register")

open(path, 'w').write(src)
PY

# ---------- 6. Compilar backend + migrar ----------
echo ""
echo "▸ 6. Compilar + migrar backend"
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
  echo "  ❌ TSC con errores"
fi
cd ..

# ---------- 7. Cliente API ----------
echo ""
echo "▸ 7. Cliente API streams"
python3 << 'PY'
path = 'shared/api/client.ts'
src = open(path).read()

if 'streams:' not in src:
    old = "    institutions: {"
    new = """    streams: {
      start: (title: string, description?: string) =>
        request<any>('/streams/start', { method: 'POST', body: JSON.stringify({ title, description }) }),
      end: (id: string) => request<any>(`/streams/${id}/end`, { method: 'POST' }),
      active: (p?: { limit?: number }) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/streams/active?${q}`);
      },
      get: (id: string) => request<any>(`/streams/${id}`),
    },
    institutions: {"""
    if old in src:
        src = src.replace(old, new, 1)
        open(path, 'w').write(src)
        print("  ✅ api.streams")
    else:
        print("  ⚠️  no encontré institutions")
else:
    print("  ·  ya estaba")
PY
cp shared/api/client.ts mobile/shared/api/client.ts 2>/dev/null

# ---------- 8. Typecheck mobile ----------
echo ""
echo "▸ 8. Typecheck mobile"
cd mobile && npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then echo "  ✅ mobile TSC limpio"; fi
cd ..

# ---------- 9. Commit ----------
echo ""
echo "▸ 9. Commit + push"
git add -A
git commit -m "feat(streams): prep — docs/STREAMS.md + migración 016 + streamService + rutas + api client" 2>&1 | head -2
git push 2>&1 | tail -2

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Bloque 4/6 (Streams prep) listo"
echo "════════════════════════════════════════════════════"
