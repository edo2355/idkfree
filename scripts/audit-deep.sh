#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — Auditoría PROFUNDA de bugs conocidos
# ============================================================
set +e
BASE="http://127.0.0.1:3000/api"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  IDKFREE — AUDITORÍA PROFUNDA"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "════════════════════════════════════════════════════════════"

# Login
TOKEN=$(curl -s -X POST $BASE/auth/login -H "Content-Type: application/json" -d '{"email":"test@idkfree.app","password":"MiPassword12345"}' | python3 -c "import sys,json;print(json.load(sys.stdin).get('accessToken',''))" 2>/dev/null)
[ -z "$TOKEN" ] && { echo "❌ Login falló"; exit 1; }
H="Authorization: Bearer $TOKEN"

echo ""
echo "▸ 1. AVATARES EN DB"
cd ~/idkfree/backend
node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('./aldea.db');
const users = db.prepare('SELECT alias, avatar_url, name FROM users').all();
for (const u of users) {
  const status = u.avatar_url ? '✅' : '❌';
  console.log('  ' + status + ' @' + u.alias.padEnd(12) + ' avatar: ' + (u.avatar_url ?? '(null)'));
}
"
cd ~/idkfree

echo ""
echo "▸ 2. AVATAR FIJO EN SERVER (comprobar que se sirve)"
curl -s -o /dev/null -w "  avatar ana:    HTTP %{http_code}\n" -m 3 "http://127.0.0.1:3000/uploads/1cd06452-f0b0-4800-89c5-694ee91f0145.jpeg"
curl -s -o /dev/null -w "  avatar edo:    HTTP %{http_code}\n" -m 3 "http://127.0.0.1:3000/uploads/fa8f0e84-6cab-42e5-98df-b5ac23bd13ae.jpeg"

echo ""
echo "▸ 3. PERFIL PÚBLICO DEVUELVE AVATAR"
curl -s "$BASE/users/ana" -H "$H" | python3 -c "
import sys, json
try:
  d = json.load(sys.stdin)
  u = d.get('user', {})
  av = u.get('avatar_url')
  print('  ✅ GET /users/ana → avatar_url:', av if av else '❌ NULL')
  print('  ✅ stats:', d.get('stats'))
  print('  ✅ is_following:', d.get('is_following'))
except Exception as e:
  print('  ❌ Error:', e)
"

echo ""
echo "▸ 4. FOLLOW + CONTEO"
FOLLOW_RAW=$(curl -s "$BASE/users/testuser" -H "$H")
FOLLOW_N=$(echo "$FOLLOW_RAW" | python3 -c "import sys,json;print(json.load(sys.stdin).get('stats',{}).get('following',0))")
echo "  testuser siguiendo a: $FOLLOW_N"
ANA_N=$(curl -s "$BASE/users/ana" -H "$H" | python3 -c "import sys,json;print(json.load(sys.stdin).get('stats',{}).get('followers',0))")
echo "  ana tiene seguidores: $ANA_N"

echo ""
echo "▸ 5. RESOLVE ASSET URL (simulación)"
echo "  URL relativa:      /uploads/fa8f0e84-6cab-42e5-98df-b5ac23bd13ae.jpeg"
echo "  URL resuelta:      http://127.0.0.1:3000/uploads/fa8f0e84-6cab-42e5-98df-b5ac23bd13ae.jpeg"

echo ""
echo "▸ 6. CÓDIGO: usar resolveAssetUrl en cada pantalla"
for f in \
  "mobile/src/components/Avatar.tsx" \
  "mobile/src/components/PostCard.tsx" \
  "mobile/src/components/CommentsModal.tsx" \
  "mobile/src/screens/UserProfileScreen.tsx" \
  "mobile/src/screens/ProfileScreen.tsx" \
  "mobile/src/screens/ChatScreen.tsx" \
  "mobile/src/screens/ChatsScreen.tsx" \
  "mobile/src/components/HeaderBar.tsx" ; do
  if [ -f "$f" ]; then
    n=$(grep -c "resolveAssetUrl\|resolveAsset" "$f" 2>/dev/null)
    raw=$(grep -c 'source={{ uri: .*avatar_url' "$f" 2>/dev/null)
    if [ "$n" -gt 0 ]; then
      echo "  ✅ $f (usa resolve)"
    elif [ "$raw" -gt 0 ]; then
      echo "  ❌ $f (usa avatar_url CRUDA → bug)"
    else
      echo "  ·  $f (no aplica)"
    fi
  fi
done

echo ""
echo "▸ 7. CÓDIGO: contadores y follow"
for f in \
  "mobile/src/screens/UserProfileScreen.tsx" \
  "mobile/src/screens/ProfileScreen.tsx" ; do
  if [ -f "$f" ]; then
    focus=$(grep -c "useFocusEffect" "$f" 2>/dev/null)
    if [ "$focus" -gt 0 ]; then
      echo "  ✅ $f (refresca al volver)"
    else
      echo "  ⚠️  $f (sin useFocusEffect → contadores viejos)"
    fi
  fi
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  FIN DE LA AUDITORÍA PROFUNDA"
echo "════════════════════════════════════════════════════════════"
echo ""
