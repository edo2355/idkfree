#!/data/data/com.termux/files/usr/bin/bash
# IDKFREE — Bootstrap para dispositivo nuevo (Termux)
# Uso:  cd ~/idkfree && bash bootstrap.sh
set +e

echo "════════════════════════════════════════════════════"
echo "  IDKFREE — Bootstrap (nuevo dispositivo)"
echo "════════════════════════════════════════════════════"
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT" || exit 1
echo "  Raíz: $ROOT"
echo ""

# ---------- 1. Dependencias del sistema ----------
echo "▸ 1. Dependencias (git, node, npm)..."
command -v git  >/dev/null || pkg install -y git
command -v node >/dev/null || pkg install -y nodejs-lts
echo "  git:  $(git --version)"
echo "  node: $(node --version 2>/dev/null || echo '❌')"
echo "  npm:  $(npm --version  2>/dev/null || echo '❌')"
echo ""

# ---------- 2. Symlink mobile/shared → ../shared ----------
echo "▸ 2. Symlink mobile/shared → ../shared"
if [ -d mobile ]; then
  cd mobile
  [ -L shared ] && rm shared
  ln -s ../shared shared
  echo "  ✅ ok"
  cd "$ROOT"
else
  echo "  ⚠️  no existe mobile/"
fi
echo ""

# ---------- 3. Backend .env ----------
echo "▸ 3. backend/.env"
if [ -f backend/.env ]; then
  echo "  · ya existe, no se toca"
else
  cat > backend/.env << 'ENVEOF'
PORT=3000
HOST=0.0.0.0
JWT_SECRET=CAMBIA_ESTO_POR_UN_SECRETO_LARGO_UNICO
NODE_ENV=development
ENVEOF
  echo "  ✅ creado (⚠️  editar JWT_SECRET)"
fi
echo ""

# ---------- 4. npm install ----------
echo "▸ 4. npm install (puede tardar 15-30 min en móvil)"
for d in backend web mobile; do
  if [ -d "$ROOT/$d" ]; then
    cd "$ROOT/$d"
    if [ -d node_modules ]; then
      echo "  · $d/node_modules ya existe, salto"
    else
      echo "  → instalando $d ..."
      npm install --no-audit --no-fund 2>&1 | tail -2
    fi
  fi
done
cd "$ROOT"
echo ""

# ---------- 5. Compilar backend ----------
echo "▸ 5. Compilar backend (tsc + migraciones)"
if [ -d backend ]; then
  cd backend
  npx tsc 2>&1 | head -5
  mkdir -p dist/db/migrations
  cp src/db/migrations/*.sql dist/db/migrations/ 2>/dev/null
  echo "  ✅ backend/dist listo"
  cd "$ROOT"
fi
echo ""

echo "════════════════════════════════════════════════════"
echo "  ✅ Bootstrap completo"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Siguientes pasos:"
echo "  1. Editar backend/.env → JWT_SECRET"
echo "  2. (Opcional) copiar backend/aldea.db desde el A06"
echo "  3. Arrancar:  bash ~/idkfree/start-all.sh"
echo ""
