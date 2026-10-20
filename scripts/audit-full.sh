#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree

echo "════════════════════════════════════════════════════"
echo "  IDKFREE — ESTADO ACTUAL"
echo "  $(date '+%Y-%m-%d %H:%M')"
echo "════════════════════════════════════════════════════"
echo ""

# Servicios
echo "▸ SERVICIOS"
pgrep -f "dist/server.js" >/dev/null && echo "  ✅ backend  :3000" || echo "  ❌ backend"
pgrep -f "expo start" >/dev/null && echo "  ✅ metro    :8081" || echo "  ❌ metro"
pgrep -f "termix" >/dev/null && echo "  ✅ termix   :30001" || echo "  ·  termix"
pgrep -f "http.server 8000" >/dev/null && echo "  ✅ playground :8000" || echo "  ·  playground"
pgrep -f "npm run dev" >/dev/null && echo "  ✅ vite web :5173" || echo "  ·  vite web"
pgrep -f sshd >/dev/null && echo "  ✅ sshd     :8022" || echo "  ❌ sshd"

echo ""
echo "▸ RAM"
free -h | head -2 | sed 's/^/  /'

echo ""
echo "▸ GIT"
git log -1 --oneline | sed 's/^/  /'
git status --short | head -8 | sed 's/^/  /'

echo ""
echo "▸ BACKEND — Módulos"
for m in auth posts follows comments notifications search hashtags vibes legacy card recovery messages uploads stories reposts; do
  ls backend/src/routes/$m.ts >/dev/null 2>&1 && echo "  ✅ $m" || echo "  ·  $m"
done

echo ""
echo "▸ MOBILE — Pantallas"
for s in SplashScreen LoginScreen RegisterScreen FeedScreen CreateScreen SearchScreen ReelsScreen NotificationsScreen ProfileScreen UserProfileScreen ChatsScreen ChatScreen HashtagScreen VibesScreen CardScreen EditProfileScreen SettingsScreen ChangePasswordScreen RecoveryScreen ConfigScreen; do
  ls mobile/src/screens/$s.tsx >/dev/null 2>&1 && echo "  ✅ $s" || echo "  ·  $s"
done

echo ""
echo "▸ MOBILE — Componentes clave"
for c in Avatar PostCard PostMasonry StoriesRow StoryViewer NotesRow DrawingCanvas DrawingsViewer CommentsModal HeaderBar Button Input; do
  ls mobile/src/components/$c.tsx >/dev/null 2>&1 && echo "  ✅ $c" || echo "  ·  $c"
done

echo ""
echo "▸ MOBILE — Iconos SVG"
ls mobile/src/components/icons/*.tsx 2>/dev/null | xargs -n1 basename | sed 's/^/  /'

echo ""
echo "▸ MIGRACIONES DB"
cd backend
node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('./aldea.db');
const tables = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name\").all();
const migs = db.prepare('SELECT COUNT(*) AS n FROM migrations').get();
console.log('  Migraciones aplicadas: ' + migs.n);
console.log('  Tablas (' + tables.length + '):');
tables.forEach(t => {
  try {
    const c = db.prepare('SELECT COUNT(*) AS n FROM ' + t.name).get();
    console.log('    · ' + t.name.padEnd(22) + ' ' + c.n + ' filas');
  } catch(e) { console.log('    · ' + t.name); }
});
"

echo ""
echo "▸ TYPECHECK"
cd ~/idkfree/backend && npx tsc --noEmit 2>&1 | head -3 | sed 's/^/  /'
[ ${PIPESTATUS[0]} -eq 0 ] && echo "  ✅ backend TSC limpio" || echo "  ❌ backend"
cd ~/idkfree/mobile && npx tsc --noEmit 2>&1 | head -3 | sed 's/^/  /'
[ ${PIPESTATUS[0]} -eq 0 ] && echo "  ✅ mobile TSC limpio" || echo "  ❌ mobile"

echo ""
echo "════════════════════════════════════════════════════"
