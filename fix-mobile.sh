#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX MOBILE — Todo lo pendiente"
echo "════════════════════════════════════════════════════"
echo ""

# ============ 1. PostCard 🔁 opacidad ============
echo "▸ 1. PostCard 🔁 (opacidad)"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src

# Buscar la línea del emoji 🔁 y quitar el color, aplicar opacidad
variants = [
    ('<Text style={{ fontSize: 18, color: theme.textMuted }}>🔁</Text>',
     '<Text style={{ fontSize: 20, opacity: 0.5 }}>🔁</Text>'),
    ('<Text style={{ fontSize: 20, color: theme.textMuted, opacity: reposting ? 0.5 : 1 }}>🔁</Text>',
     '<Text style={{ fontSize: 20, opacity: reposting ? 0.3 : 0.5 }}>🔁</Text>'),
    ('<Text style={{ fontSize: 20, color: theme.textMuted }}>🔁</Text>',
     '<Text style={{ fontSize: 20, opacity: 0.5 }}>🔁</Text>'),
]
done = False
for old, new in variants:
    if old in src:
        src = src.replace(old, new, 1)
        done = True
        break

if done:
    open(path, 'w').write(src)
    print("  ✅ 🔁 con opacidad")
else:
    # Diagnóstico
    import re
    m = re.search(r'<Text[^>]*>🔁</Text>', src)
    if m:
        print(f"  ⚠️  línea actual: {m.group(0)}")
    else:
        print("  ❌ no encontré el emoji 🔁")
PY

# ============ 2. ChatsScreen con NotesRow ============
echo ""
echo "▸ 2. ChatsScreen + NotesRow"
python3 << 'PY'
path = 'src/screens/ChatsScreen.tsx'
src = open(path).read()
orig = src

# Import
if 'NotesRow' not in src:
    if "import { Avatar }" in src:
        src = src.replace(
            "import { Avatar }",
            "import { NotesRow } from '../components/NotesRow';\nimport { Avatar }",
            1
        )
    print("  ✅ import NotesRow")

# Añadir NotesRow antes del FlatList de chats
if '<NotesRow' not in src and '<FlatList' in src:
    src = src.replace(
        '<FlatList',
        '<NotesRow />\n\n      <FlatList',
        1
    )
    print("  ✅ NotesRow antes del FlatList")

if src != orig:
    open(path, 'w').write(src)
else:
    print("  ⚠️  sin cambios")
PY

# ============ 3. INFO: VibesScreen ============
echo ""
echo "▸ 3. VibesScreen — estado actual (revisar)"
grep -n "RECIENTES\|TODOS\|LEGADO\|Tab\b\|useState" src/screens/VibesScreen.tsx | head -20

# ============ 4. INFO: ProfileScreen ============
echo ""
echo "▸ 4. ProfileScreen — estructura (revisar)"
grep -n "FlatList\|ScrollView\|numColumns\|posts.map\|renderItem" src/screens/ProfileScreen.tsx | head -20
echo "  Líneas: $(wc -l < src/screens/ProfileScreen.tsx)"

# ============ 5. INFO: AppTabs tab Create ============
echo ""
echo "▸ 5. AppTabs — tab Create (revisar)"
sed -n '90,115p' src/navigation/AppTabs.tsx

# ============ 6. Typecheck ============
echo ""
echo "▸ 6. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ============ 7. Commit ============
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 7. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "fix(mobile): PostCard repost opacidad + ChatsScreen NotesRow" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIX MOBILE (parte 1)"
echo "════════════════════════════════════════════════════"
