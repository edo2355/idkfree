#!/data/data/com.termux/files/usr/bin/bash
set +e
BASE="http://127.0.0.1:3000/api"

echo "════════════════════════════════════════════════════"
echo "  TEST — Endpoints Historias"
echo "════════════════════════════════════════════════════"
echo ""

TOKEN=$(curl -s -X POST $BASE/auth/login -H "Content-Type: application/json" -d '{"email":"test@idkfree.app","password":"MiPassword12345"}' | python3 -c "import sys,json;print(json.load(sys.stdin).get('accessToken',''))" 2>/dev/null)
[ -z "$TOKEN" ] && { echo "❌ Login falló"; exit 1; }
H="Authorization: Bearer $TOKEN"
CT="Content-Type: application/json"
echo "✅ Login"

echo ""
echo "▸ 1. POST /api/stories (crear historia fake)"
R=$(curl -s -w "\n[code:%{http_code}]" -X POST "$BASE/stories" -H "$H" -H "$CT" \
  -d '{"mediaUrl":"/uploads/fa8f0e84-6cab-42e5-98df-b5ac23bd13ae.jpeg","mediaType":"image"}')
echo "$R"

echo ""
echo "▸ 2. GET /api/stories/feed"
curl -s "$BASE/stories/feed" -H "$H" | python3 -m json.tool | head -40

echo ""
echo "▸ 3. Verificar tablas en DB"
cd ~/idkfree/backend
node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('./aldea.db');
console.log('stories:', db.prepare('SELECT COUNT(*) AS n FROM stories').get());
console.log('story_views:', db.prepare('SELECT COUNT(*) AS n FROM story_views').get());
console.log('drawn_posts:', db.prepare('SELECT COUNT(*) AS n FROM drawn_posts').get());
"

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIN TEST"
echo "════════════════════════════════════════════════════"
