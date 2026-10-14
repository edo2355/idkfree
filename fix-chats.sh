#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX Chats — notas arriba + limpiar header"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 0. Diagnóstico ----------
echo "▸ 0. Estado actual de ChatsScreen.tsx"
echo "  Líneas: $(wc -l < src/screens/ChatsScreen.tsx)"
echo "  Usa HeaderBar? $(grep -c 'HeaderBar' src/screens/ChatsScreen.tsx)"
echo "  Usa NotificationIcon? $(grep -c 'NotificationIcon' src/screens/ChatsScreen.tsx)"
echo "  Usa 🔔? $(grep -c '🔔' src/screens/ChatsScreen.tsx)"
echo "  Usa Avatar? $(grep -c 'Avatar' src/screens/ChatsScreen.tsx)"
echo "  Usa NotesRow? $(grep -c 'NotesRow' src/screens/ChatsScreen.tsx)"
echo ""

# ---------- 1. Backup ----------
cp src/screens/ChatsScreen.tsx ~/chats.bak 2>/dev/null
echo "▸ 1. Backup en ~/chats.bak"

# ---------- 2. Aplicar cambios ----------
echo ""
echo "▸ 2. Aplicando cambios"
python3 << 'PY'
path = 'src/screens/ChatsScreen.tsx'
src = open(path).read()
orig = src

# 2a. Import NotesRow si no está
if 'NotesRow' not in src:
    if 'import { Avatar }' in src:
        src = src.replace(
            "import { Avatar }",
            "import { NotesRow } from '../components/NotesRow';\nimport { Avatar }",
            1
        )
        print("  ✅ Import NotesRow")
    elif 'from ' in src:
        # Insertar tras último import
        import re
        lines = src.split('\n')
        last_import = max(i for i, l in enumerate(lines) if l.startswith('import '))
        lines.insert(last_import + 1, "import { NotesRow } from '../components/NotesRow';")
        src = '\n'.join(lines)
        print("  ✅ Import NotesRow (fallback)")

# 2b. Quitar 🔔 (NotificationIcon o emoji)
src = src.replace(
    """<TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.6}>
          <NotificationIcon size={22} color={theme.text} />
        </TouchableOpacity>""",
    "", 1
)
src = src.replace(
    """<TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.6}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>""",
    "", 1
)

# 2c. Quitar avatar del header (el que se ve en la esquina derecha)
# Patrón típico: TouchableOpacity con navigate('Profile') + Avatar
src = src.replace(
    """<TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.6}>
          <Avatar name={user?.name ?? user?.alias} url={user?.avatar_url} size={32} />
        </TouchableOpacity>""",
    "", 1
)

# 2d. Añadir NotesRow arriba de la lista
# Buscar el inicio del FlatList
if 'NotesRow' in src and '<NotesRow' not in src:
    # Antes del FlatList de chats
    if '<FlatList' in src:
        src = src.replace(
            '<FlatList',
            '<NotesRow />\n      <FlatList',
            1
        )
        print("  ✅ NotesRow antes del FlatList")
    else:
        print("  ⚠️  no encontré FlatList — revisar manualmente")

# 2e. Quitar variable user si quedó huérfana
# (solo si ya no se usa)
if 'useAuthStore' in src:
    # Verificar si user se usa todavía
    uses = src.count('user?')
    if uses == 0 and 'const user' in src:
        # Comentar la línea (no borrar para no romper imports)
        pass

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ Cambios aplicados")
else:
    print("  ⚠️  Sin cambios detectados")
PY

# ---------- 3. Typecheck ----------
echo ""
echo "▸ 3. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 4. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 4. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(chats): notas arriba + header limpio (sin bell/avatar)" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  echo "⚠️  TSC falló — REVIRTIENDO desde backup"
  cp ~/chats.bak ~/idkfree/mobile/src/screens/ChatsScreen.tsx
  echo "  ↩️  Revertido"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIX Chats listo"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Backup en: ~/chats.bak"
