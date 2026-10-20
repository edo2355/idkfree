#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — Arranca TODOS los servicios
# Uso: bash ~/idkfree/start-all.sh
# ============================================================
set +e

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  IDKFREE — Arrancando servicios"
echo "════════════════════════════════════════════════════════════"

# ---------- 1. BACKEND IDKFREE ----------
echo ""
echo "▸ 1. BACKEND IDKFREE (puerto 3000)"
if curl -s -m 2 http://127.0.0.1:3000/health >/dev/null 2>&1; then
  echo "  ✅ ya estaba corriendo"
else
  cd ~/idkfree/backend
  pkill -f "dist/server.js" 2>/dev/null
  sleep 1
  nohup node dist/server.js > server.log 2>&1 &
  sleep 4
  if curl -s -m 2 http://127.0.0.1:3000/health >/dev/null 2>&1; then
    echo "  ✅ arrancado"
  else
    echo "  ❌ falló — mira: tail -20 ~/idkfree/backend/server.log"
  fi
fi

# ---------- 2. METRO (EXPO) ----------
echo ""
echo "▸ 2. METRO EXPO (puerto 8081)"
if curl -s -m 2 http://127.0.0.1:8081/status >/dev/null 2>&1; then
  echo "  ✅ ya estaba corriendo"
else
  cd ~/idkfree/mobile
  pkill -f "expo start" 2>/dev/null
  sleep 1
  nohup npx expo start --lan > expo.log 2>&1 &
  echo "  ⏳ arrancando (tarda ~15s)..."
  sleep 18
  if curl -s -m 2 http://127.0.0.1:8081/status >/dev/null 2>&1; then
    echo "  ✅ arrancado"
  else
    echo "  ⚠️  puede seguir arrancando — revisa: tail -10 ~/idkfree/mobile/expo.log"
  fi
fi

# ---------- 3. TERMIX ----------
echo ""
echo "▸ 3. TERMIX (puerto 30001)"
if curl -s -m 2 http://127.0.0.1:30001/health >/dev/null 2>&1; then
  echo "  ✅ ya estaba corriendo"
else
  cd ~/Termix
  pkill -f "termix" 2>/dev/null
  sleep 1
  DATA_DIR=./db/data nohup node dist/backend/backend/starter.js > termix.log 2>&1 &
  echo "  ⏳ arrancando (tarda ~10s)..."
  sleep 12
  if curl -s -m 2 http://127.0.0.1:30001/health >/dev/null 2>&1; then
    echo "  ✅ arrancado"
  else
    echo "  ⚠️  revisa: tail -20 ~/Termix/termix.log"
  fi
fi

# ---------- 4. SSHD ----------
echo ""
echo "▸ 4. SSHD (puerto 8022)"
if pgrep -f "sshd" >/dev/null 2>&1; then
  echo "  ✅ ya estaba corriendo"
else
  sshd
  sleep 1
  pgrep -f "sshd" >/dev/null && echo "  ✅ arrancado" || echo "  ❌ falló"
fi

# ---------- RESUMEN ----------
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  RESUMEN"
echo "════════════════════════════════════════════════════════════"
check_with_retry() {
  local name="$1" url="$2" port="$3"
  for i in 1 2 3 4 5; do
    if curl -s -m 3 "$url" >/dev/null 2>&1; then
      echo "  ✅ $name  $port"
      return 0
    fi
    sleep 2
  done
  echo "  ❌ $name  $port (no responde)"
  return 1
}
check_with_retry "backend" "http://127.0.0.1:3000/health"  "http://127.0.0.1:3000"
check_with_retry "metro  " "http://127.0.0.1:8081/status"  "http://127.0.0.1:8081"
check_with_retry "termix " "http://127.0.0.1:30001/health" "http://127.0.0.1:30001"
pgrep -f "sshd" >/dev/null 2>&1 && echo "  ✅ sshd   ssh://$(whoami)@127.0.0.1:8022" || echo "  ❌ sshd"

echo ""
echo "  RAM libre:"
free -h | grep -E "Mem|Swap" | sed 's/^/    /'

echo ""
echo "  Comandos útiles:"
echo "    bash ~/idkfree/stop-all.sh      → detener todo"
echo "    bash ~/idkfree/audit.sh         → auditoría completa"
echo "    tail -f ~/idkfree/backend/server.log"
echo "    tail -f ~/idkfree/mobile/expo.log"
echo ""
