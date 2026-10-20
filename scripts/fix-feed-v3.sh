#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX v3 — Header + NotesRow + PostCard + StoryViewer"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. HeaderBar: quitar ⚙️ y 🔔 ----------
echo "▸ 1. HeaderBar: quitar ⚙️ y 🔔"
python3 << 'PY'
path = 'src/components/HeaderBar.tsx'
src = open(path).read()
orig = src

# Quitar el bloque de Settings (gear)
src = src.replace(
    """      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      )}""",
    """      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}""",
    1
)

# Quitar la campana 🔔
src = src.replace(
    """        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.6}>
          <NotificationIcon size={22} color={theme.text} />
        </TouchableOpacity>

""", "", 1
)

# Fallback por si era emoji en vez de NotificationIcon
src = src.replace(
    """        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.6}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>

""", "", 1
)

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ HeaderBar limpio")
else:
    print("  ⚠️  sin cambios")
PY

# ---------- 2. NotesRow: quitar círculo "Tu nota" ----------
echo "▸ 2. NotesRow: quitar círculo 💭"
python3 << 'PY'
path = 'src/components/NotesRow.tsx'
src = open(path).read()
orig = src

# Quitar el bloque de "Mi nota"
start = src.find("{/* Mi nota */}")
if start != -1:
    end = src.find("{/* Notas de otros */}", start)
    if end != -1:
        src = src[:start] + src[end:]
        open(path, 'w').write(src)
        print("  ✅ Círculo Tu nota eliminado")
    else:
        print("  ⚠️  no encontré 'Notas de otros'")
else:
    print("  ⚠️  no encontré 'Mi nota'")
PY

# ---------- 3. PostCard: 🔁 gris en vez de naranja ----------
echo "▸ 3. PostCard: 🔁 sin naranja"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src

# El emoji 🔁 de Windows sale naranja por el propio emoji.
# Lo cambiamos por un Text con color forzado usando el mismo emoji pero filtrado
# Mejor: usar el mismo patrón de ShareIcon/HeartIcon: color theme.textMuted
# Como no tenemos RepostIcon, usamos un Text con opacidad para que el naranja se vea gris

src = src.replace(
    '<Text style={{ fontSize: 20, color: theme.textMuted, opacity: reposting ? 0.5 : 1 }}>🔁</Text>',
    '<Text style={{ fontSize: 20, opacity: reposting ? 0.3 : 0.5 }}>🔁</Text>',
    1
)

# Aplicar también al tamaño 18 (por si el fix no se aplicó antes)
src = src.replace(
    '<Text style={{ fontSize: 18, color: theme.textMuted }}>🔁</Text>',
    '<Text style={{ fontSize: 20, opacity: 0.5 }}>🔁</Text>',
    1
)

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ 🔁 con opacidad (grisáceo)")
else:
    print("  ·  ya estaba")
PY

# ---------- 4. StoryViewer: fix setState en render ----------
echo "▸ 4. StoryViewer: fix setState-in-render"
python3 << 'PY'
path = 'src/components/StoryViewer.tsx'
src = open(path).read()
orig = src

# El error viene de: if (!group || !story) { onClose(); return null; }
# onClose dispara setState en el padre (StoriesRow) durante render.
# Fix: usar useEffect para llamar onClose cuando no hay story.
old = """  if (!group || !story) { onClose(); return null; }"""
new = """  useEffect(() => {
    if (!group || !story) onClose();
  }, [group, story]);

  if (!group || !story) return null;"""

if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("  ✅ StoryViewer con useEffect")
else:
    print("  ⚠️  patrón no encontrado — revisar manualmente")
PY

# ---------- 5. Typecheck ----------
echo ""
echo "▸ 5. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 6. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 6. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "fix(ui): HeaderBar sin gear/bell, NotesRow sin circulo duplicado, StoryViewer setState fix, PostCard repost grisaceo" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIX v3 listo"
echo "════════════════════════════════════════════════════"
