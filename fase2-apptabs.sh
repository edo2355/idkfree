#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 2 — Aplicar iconos SVG a AppTabs"
echo "════════════════════════════════════════════════════"
echo ""

# ---- 1. Leer AppTabs completo ----
echo "▸ 1. Contenido actual de AppTabs.tsx"
echo "────────────────────────────────────────────────────"
cat src/navigation/AppTabs.tsx
echo "────────────────────────────────────────────────────"
echo ""

# ---- 2. Reemplazar emoji 🎬 por ReelsIcon ----
echo "▸ 2. Reemplazando emoji Reels por ReelsIcon"
python3 << 'PY'
path = 'src/navigation/AppTabs.tsx'
src = open(path).read()
orig = src

# Import ReelsIcon si no está
if 'ReelsIcon' not in src:
    if "import { ProfileIcon }" in src:
        src = src.replace(
            "import { ProfileIcon }",
            "import { ReelsIcon } from '../components/icons/ReelsIcon';\nimport { ProfileIcon }",
            1
        )
    else:
        # fallback: insertar después del último import
        lines = src.split('\n')
        last_import = max(i for i, l in enumerate(lines) if l.startswith('import '))
        lines.insert(last_import + 1, "import { ReelsIcon } from '../components/icons/ReelsIcon';")
        src = '\n'.join(lines)

# Reemplazar emoji 🎬 por componente
src = src.replace(
    """options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🎬</Text> }}""",
    """options={{ tabBarIcon: ({ color, focused }) => <ReelsIcon size={24} color={color} filled={focused} /> }}"""
)

# También por si está en formato multilinea
src = src.replace(
    """tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🎬</Text>""",
    """tabBarIcon: ({ color, focused }) => <ReelsIcon size={24} color={color} filled={focused} />"""
)

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ ReelsIcon aplicado")
else:
    print("  ⚠️  sin cambios (revisa el emoji manualmente)")
PY

# ---- 3. Typecheck ----
echo ""
echo "▸ 3. Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---- 4. Commit ----
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 4. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(ui): AppTabs usa ReelsIcon SVG en vez de emoji" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIN"
echo "════════════════════════════════════════════════════"
