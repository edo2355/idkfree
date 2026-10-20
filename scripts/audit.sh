#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — Auditoría completa del proyecto
# Uso: bash ~/idkfree/audit.sh
# ============================================================
set +e
cd ~/idkfree 2>/dev/null || { echo "No existe ~/idkfree"; exit 1; }

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  IDKFREE — AUDITORÍA COMPLETA"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "════════════════════════════════════════════════════════════"

# ---------- 1. PROCESOS ----------
echo ""
echo "▸ 1. PROCESOS CLAVE"
pgrep -f "dist/server.js" >/dev/null && echo "  ✅ backend: VIVO" || echo "  ❌ backend: CAÍDO"
pgrep -f "expo start"     >/dev/null && echo "  ✅ metro:   VIVO" || echo "  ❌ metro:   CAÍDO"
pgrep -f "code-server"    >/dev/null && echo "  ⚠️  code-server: VIVO (consume RAM)" || echo "  ·  code-server: down"

# ---------- 2. PUERTOS ----------
echo ""
echo "▸ 2. PUERTOS"
curl -s -m 2 http://127.0.0.1:3000/health && echo "  → backend OK" || echo "  ❌ backend no responde"
curl -s -m 2 http://127.0.0.1:8081/status && echo "  → metro OK" || echo "  ❌ metro no responde"

# ---------- 3. MEMORIA ----------
echo ""
echo "▸ 3. MEMORIA"
free -h | grep -E "Mem|Swap"

# ---------- 4. GIT ----------
echo ""
echo "▸ 4. GIT"
git status --short | head -20
echo "  Rama: $(git branch --show-current) · Último commit: $(git log -1 --oneline)"

# ---------- 5. TYPECHECK BACKEND ----------
echo ""
echo "▸ 5. TYPECHECK BACKEND"
cd backend && npx tsc --noEmit 2>&1 | head -15 && echo "  ✅ backend tsc limpio"
cd ..

# ---------- 6. TYPECHECK MOBILE ----------
echo ""
echo "▸ 6. TYPECHECK MOBILE"
cd mobile && npx tsc --noEmit 2>&1 | head -15 && echo "  ✅ mobile tsc limpio"
cd ..

# ---------- 7. ARCHIVOS CLAVE ----------
echo ""
echo "▸ 7. ARCHIVOS CLAVE"
for f in \
  "backend/src/server.ts" \
  "backend/src/routes/posts.ts" \
  "backend/src/routes/follows.ts" \
  "backend/src/services/postService.ts" \
  "backend/src/services/followService.ts" \
  "shared/api/client.ts" \
  "mobile/src/screens/CreateScreen.tsx" \
  "mobile/src/screens/ReelsScreen.tsx" \
  "mobile/src/components/PostCard.tsx" \
  "mobile/src/screens/UserProfileScreen.tsx" \
  "mobile/src/screens/ProfileScreen.tsx" ; do
  if [ -f "$f" ]; then
    echo "  ✅ $f ($(wc -l < $f) líneas)"
  else
    echo "  ❌ FALTA: $f"
  fi
done

# ---------- 8. DB — TABLAS ----------
echo ""
echo "▸ 8. DB — TABLAS Y CONTEO"
cd backend
node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('./aldea.db');
const tables = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name\").all();
for (const t of tables) {
  try {
    const c = db.prepare('SELECT COUNT(*) AS n FROM ' + t.name).get();
    console.log('  · ' + t.name.padEnd(24) + ' → ' + c.n + ' filas');
  } catch (e) { console.log('  · ' + t.name + ' (error)'); }
}
" 2>&1 | head -30

# ---------- 9. DB — MIGRACIONES ----------
echo ""
echo "▸ 9. MIGRACIONES"
ls src/db/migrations/*.sql 2>/dev/null | wc -l | xargs echo "  Migraciones en src:"
ls dist/db/migrations/*.sql 2>/dev/null | wc -l | xargs echo "  Migraciones en dist:"
diff <(ls src/db/migrations/ 2>/dev/null) <(ls dist/db/migrations/ 2>/dev/null) >/dev/null 2>&1 && echo "  ✅ src y dist sincronizadas" || echo "  ⚠️  src y dist DESINCRONIZADAS"

# ---------- 10. ENDPOINTS ----------
echo ""
echo "▸ 10. ENDPOINTS (con token)"
TOKEN=$(curl -s -X POST http://127.0.0.1:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@idkfree.app","password":"MiPassword12345"}' | python3 -c "import sys,json;print(json.load(sys.stdin).get('accessToken',''))" 2>/dev/null)
if [ -z "$TOKEN" ]; then
  echo "  ❌ No pude loguear (¿backend arriba?)"
else
  echo "  ✅ Token obtenido"
  for ep in \
    "/api/auth/me" \
    "/api/feed?limit=5" \
    "/api/reels" \
    "/api/messages" \
    "/api/notifications" \
    "/api/me/card" ; do
    code=$(curl -s -o /dev/null -w "%{http_code}" -m 3 "http://127.0.0.1:3000$ep" -H "Authorization: Bearer $TOKEN")
    if [ "$code" = "200" ]; then echo "  ✅ $ep → 200"
    else echo "  ⚠️  $ep → $code"
    fi
  done
fi
cd ..

# ---------- 11. LOGS RECIENTES ----------
echo ""
echo "▸ 11. ÚLTIMOS ERRORES (backend)"
grep '"level":50' backend/server.log 2>/dev/null | tail -5 | python3 -c "
import sys, json
for line in sys.stdin:
    try:
        d = json.loads(line)
        print('  ⚠️  ' + d.get('msg','?')[:120])
    except: pass
" || echo "  ✅ Sin errores en log"

echo ""
echo "▸ 12. LOGS RECIENTES (metro)"
tail -5 mobile/expo.log 2>/dev/null | sed 's/^/  /'

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  FIN DEL REPORTE"
echo "════════════════════════════════════════════════════════════"
echo ""
