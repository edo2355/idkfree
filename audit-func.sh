#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — Auditoría FUNCIONAL end-to-end
# ============================================================
set +e
BASE="http://127.0.0.1:3000/api"
mkdir -p $HOME/tmp

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  IDKFREE — AUDITORÍA FUNCIONAL"
echo "  $(date '+%H:%M:%S')"
echo "════════════════════════════════════════════════════════════"

# Login
TOKEN=$(curl -s -X POST $BASE/auth/login -H "Content-Type: application/json" -d '{"email":"test@idkfree.app","password":"MiPassword12345"}' | python3 -c "import sys,json;print(json.load(sys.stdin).get('accessToken',''))" 2>/dev/null)
[ -z "$TOKEN" ] && { echo "❌ Login falló"; exit 1; }
echo "✅ Login"

H="Authorization: Bearer $TOKEN"
CT="Content-Type: application/json"

# Test helper
test_ep() {
  local name="$1" method="$2" url="$3" data="$4" expected="${5:-200,201}"
  local code
  if [ -z "$data" ] && { [ "$method" = "POST" ] || [ "$method" = "PUT" ] || [ "$method" = "PATCH" ]; }; then
    data="{}"
  fi
  if [ -n "$data" ]; then
    code=$(curl -s -o $HOME/tmp/audit_resp -w "%{http_code}" -m 5 -X "$method" "$BASE$url" -H "$H" -H "$CT" -d "$data")
  else
    code=$(curl -s -o $HOME/tmp/audit_resp -w "%{http_code}" -m 5 -X "$method" "$BASE$url" -H "$H" -H "$CT")
  fi
  if echo "$expected" | grep -q "$code"; then
    echo "  ✅ $name → $code"
  else
    echo "  ❌ $name → $code  ($(head -c 150 $HOME/tmp/audit_resp))"
  fi
}

# ID de ana para follow
ANA_ID="6b597f8a-01fb-4a63-b873-4a6ea6d8d31d"

echo ""
echo "▸ AUTH"
test_ep "GET /auth/me"           GET  "/auth/me"

echo ""
echo "▸ POSTS"
test_ep "POST /posts (texto)"      POST "/posts" '{"body":"Audit post '$(date +%s)'","visibility":"followers"}'
test_ep "POST /posts (vacío)"      POST "/posts" '{"visibility":"followers"}' "400"
POST_ID=$(cat $HOME/tmp/audit_resp | python3 -c "import sys,json;print(json.load(sys.stdin).get('post',{}).get('id',''))" 2>/dev/null)
[ -n "$POST_ID" ] && echo "  → Post ID: $POST_ID" || echo "  → Sin ID"
test_ep "GET /feed"              GET  "/feed?limit=3"
test_ep "GET /reels"             GET  "/reels"

echo ""
echo "▸ LIKES (necesita POST_ID=$POST_ID)"
if [ -n "$POST_ID" ]; then
  test_ep "POST /posts/:id/like"   POST "/posts/$POST_ID/like"
  test_ep "DELETE /posts/:id/like" DELETE "/posts/$POST_ID/like"
else
  echo "  ⏭  Saltado (no hay post)"
fi

echo ""
echo "▸ COMMENTS"
if [ -n "$POST_ID" ]; then
  test_ep "POST /posts/:id/comments" POST "/posts/$POST_ID/comments" '{"body":"Comentario audit"}'
  test_ep "GET /posts/:id/comments"  GET  "/posts/$POST_ID/comments"
else
  echo "  ⏭  Saltado"
fi

echo ""
echo "▸ FOLLOWS"
test_ep "GET /users/:id/followers" GET "/users/$ANA_ID/followers"
test_ep "GET /users/:id/following" GET "/users/$ANA_ID/following"
# Follow es idempotente
test_ep "POST /users/:id/follow"  POST "/users/$ANA_ID/follow"
test_ep "DELETE /users/:id/follow" DELETE "/users/$ANA_ID/follow"

echo ""
echo "▸ MESSAGES"
test_ep "POST /messages"          POST "/messages" '{"to":"ana","body":"Audit DM"}'
test_ep "GET /messages"           GET  "/messages"
test_ep "GET /messages/ana"       GET  "/messages/ana"

echo ""
echo "▸ NOTIFICATIONS"
test_ep "GET /notifications"      GET  "/notifications"
test_ep "POST /notifications/read-all" POST "/notifications/read-all"

echo ""
echo "▸ PROFILE"
test_ep "GET /users/testuser"     GET  "/users/testuser"
test_ep "PATCH /me/profile (name)" PATCH "/me/profile" '{"name":"Edo","bio":"Audit bio","avatar_url":null}'

echo ""
echo "▸ CARD / RECOVERY"
test_ep "GET /me/card"            GET  "/me/card"

echo ""
echo "▸ VIBES"
test_ep "POST /vibes"             POST "/vibes" '{"mood":"chill","message":"Audit vibe"}'
test_ep "GET /vibes"              GET  "/vibes"

echo ""
echo "▸ SEARCH / HASHTAGS"
test_ep "GET /search/users?q=ana" GET  "/search/users?q=ana"
test_ep "GET /hashtags/trending"  GET  "/hashtags/trending"

echo ""
echo "▸ UPLOADS"
# Crear imagen mínima
echo -n "fake-image-bytes" > $HOME/tmp/audit-test.jpg
code=$(curl -s -o $HOME/tmp/audit_up_resp -w "%{http_code}" -X POST "$BASE/uploads" -H "$H" -F "file=@$HOME/tmp/audit-test.jpg;type=image/jpeg" -m 5)
if [ "$code" = "201" ] || [ "$code" = "200" ]; then
  echo "  ✅ POST /uploads → $code"
else
  echo "  ❌ POST /uploads → $code  ($(head -c 150 $HOME/tmp/audit_up_resp))"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  FIN AUDITORÍA FUNCIONAL"
echo "════════════════════════════════════════════════════════════"
echo ""
