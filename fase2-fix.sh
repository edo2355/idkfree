#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  Fix imports en AppTabs.tsx"
echo "════════════════════════════════════════════════════"
echo ""

python3 << 'PY'
path = 'src/navigation/AppTabs.tsx'
src = open(path).read()
orig = src

# 1) Añadir import useAuthStore si falta
if 'useAuthStore' in src and "from '../stores/authStore'" not in src:
    # insertar tras useTheme
    src = src.replace(
        "import { useTheme } from '../stores/themeStore';",
        "import { useTheme } from '../stores/themeStore';\nimport { useAuthStore } from '../stores/authStore';",
        1
    )
    print("  ✅ useAuthStore importado")

# 2) Añadir import Avatar si falta
if '<Avatar' in src and "from '../components/Avatar'" not in src:
    src = src.replace(
        "import { useAuthStore } from '../stores/authStore';",
        "import { useAuthStore } from '../stores/authStore';\nimport { Avatar } from '../components/Avatar';",
        1
    )
    print("  ✅ Avatar importado")

# 3) Añadir import fonts si falta
if 'fonts.' in src and "from '../theme/fonts'" not in src:
    src = src.replace(
        "import { Avatar } from '../components/Avatar';",
        "import { Avatar } from '../components/Avatar';\nimport { fonts } from '../theme/fonts';",
        1
    )
    print("  ✅ fonts importado")

if src != orig:
    open(path, 'w').write(src)
else:
    print("  ·  sin cambios")
PY

echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  cd ~/idkfree
  git add -A
  git commit -m "fix(apptabs): añadir imports useAuthStore + Avatar + fonts" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  echo "  ❌ TSC sigue con errores — pégame la salida"
fi

echo ""
echo "════════════════════════════════════════════════════"
