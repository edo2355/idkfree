#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree || exit 1

echo "════════════════════════════════════════════════════"
echo "  BACKEND — Endpoint /users/suggestions"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Servicio ----------
echo "▸ 1. profileService: getSuggestedUsers()"
python3 << 'PY'
path = 'backend/src/services/profileService.ts'
src = open(path).read()

if 'getSuggestedUsers' not in src:
    addition = '''

// ------------------------------------------------------------
// Sugerencias: usuarios que NO sigues y NO eres tú
// Ordenados: primero los que tienen más posts, luego aleatorio
// ------------------------------------------------------------
export async function getSuggestedUsers(userId: string, limit = 10) {
  const res = await query<{
    id: string;
    alias: string;
    name: string | null;
    avatar_url: string | null;
    bio: string | null;
    posts_count: number;
    followers_count: number;
  }>(
    `SELECT u.id, u.alias, u.name, u.avatar_url, u.bio,
            (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND deleted_at IS NULL) AS posts_count,
            (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) AS followers_count
     FROM users u
     WHERE u.id != $1
       AND u.deleted_at IS NULL
       AND u.id NOT IN (SELECT followed_id FROM follows WHERE follower_id = $1)
     ORDER BY posts_count DESC, followers_count DESC, RANDOM()
     LIMIT $2`,
    [userId, limit]
  );
  return { users: res.rows };
}
'''
    src = src + addition
    open(path, 'w').write(src)
    print("  ✅ getSuggestedUsers añadido")
else:
    print("  ·  ya existe")
PY

# ---------- 2. Ruta ----------
echo "▸ 2. Ruta GET /api/users/suggestions"
python3 << 'PY'
path = 'backend/src/routes/profile.ts'
src = open(path).read()

if 'getSuggestedUsers' not in src:
    # Import
    if "getProfileByAlias" in src:
        # Buscar el import y añadir getSuggestedUsers
        import re
        m = re.search(r"import \{[^}]+\} from '\.\./services/profileService\.js';", src)
        if m:
            old = m.group(0)
            names = re.search(r"\{([^}]+)\}", old).group(1)
            new_names = names.rstrip() + ', getSuggestedUsers'
            new_import = old.replace(names, new_names)
            src = src.replace(old, new_import, 1)
            print("  ✅ import")

    # Insertar ruta ANTES de las rutas con :alias (para que /suggestions no sea capturada como :alias)
    insertion = '''
  // GET /api/users/suggestions — usuarios que quizás conozcas
  app.get('/users/suggestions', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const res = await getSuggestedUsers(req.userId!, limit ? parseInt(limit) : 10);
      return reply.send(res);
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
'''

    # Buscar el cierre de profileRoutes
    idx = src.rfind('}')
    src = src[:idx] + insertion + src[idx:]
    open(path, 'w').write(src)
    print("  ✅ ruta añadida")
else:
    print("  ·  ya existe")
PY

# ---------- 3. Compilar backend ----------
echo ""
echo "▸ 3. Compilar backend"
cd backend
npx tsc 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  mkdir -p dist/db/migrations && cp src/db/migrations/*.sql dist/db/migrations/
  pkill -f "dist/server.js"; sleep 2
  nohup node dist/server.js > server.log 2>&1 &
  sleep 4
  curl -s -m 2 http://127.0.0.1:3000/health >/dev/null && echo "  ✅ backend arriba"
else
  echo "  ❌ TSC con errores"
fi
cd ..

# ---------- 4. Añadir al cliente API ----------
echo ""
echo "▸ 4. Cliente API: api.profile.suggestions"
python3 << 'PY'
path = 'shared/api/client.ts'
src = open(path).read()

if 'suggestions' not in src:
    old = "    profile: {\n      get: (alias: string) => request<any>(`/users/${alias}`),"
    new = "    profile: {\n      get: (alias: string) => request<any>(`/users/${alias}`),\n      suggestions: (p?: { limit?: number }) => {\n        const q = new URLSearchParams();\n        if (p?.limit) q.set('limit', String(p.limit));\n        return request<any>(`/users/suggestions?${q}`);\n      },"
    if old in src:
        src = src.replace(old, new, 1)
        open(path, 'w').write(src)
        print("  ✅ api.profile.suggestions")
    else:
        print("  ⚠️  patrón profile no encontrado")
else:
    print("  ·  ya existe")
PY

cp shared/api/client.ts mobile/shared/api/client.ts 2>/dev/null
cp shared/types/index.ts mobile/shared/types/index.ts 2>/dev/null

# ---------- 5. Typecheck mobile ----------
echo ""
echo "▸ 5. Typecheck mobile"
cd mobile && npx tsc --noEmit 2>&1 | head -8
if [ ${PIPESTATUS[0]} -eq 0 ]; then echo "  ✅ mobile TSC limpio"; fi
cd ..

# ---------- 6. Commit ----------
echo ""
echo "▸ 6. Commit + push"
git add -A
git commit -m "feat(backend): endpoint /users/suggestions + cliente API suggestions" 2>&1 | head -2
git push 2>&1 | tail -2

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ SCRIPT 1 LISTO"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Prueba rápida:"
echo "    curl -s http://127.0.0.1:3000/api/users/suggestions -H 'Authorization: Bearer <token>'"
echo ""
