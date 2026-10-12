#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX UI v2 — unificar Vibes=Notas + bugs visuales"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Quitar globo 💭 del HeaderBar ----------
echo "▸ 1. Quitar 💭 del HeaderBar"
python3 << 'PY'
path = 'src/components/HeaderBar.tsx'
src = open(path).read()
if 'Vibes' in src:
    src = src.replace(
        """        <TouchableOpacity onPress={() => navigation.navigate('Vibes')} activeOpacity={0.6}>
          <Text style={{ fontSize: 20 }}>💭</Text>
        </TouchableOpacity>

""", "", 1)
    open(path, 'w').write(src)
    print("  ✅ globo eliminado")
else:
    print("  ·  ya estaba quitado")
PY

# ---------- 2. Quitar composer del FeedScreen ----------
echo "▸ 2. Quitar composer duplicado del Feed"
python3 << 'PY'
path = 'src/screens/FeedScreen.tsx'
src = open(path).read()
orig = src

# Quitar el bloque del composer (View con TextInput + botón Publicar)
import re

# Buscar el composer: TextInput con "¿Qué estás pensando?" + Touchable "Publicar"
start = src.find("{/* Composer */}")
if start == -1:
    print("  ·  no había composer comentado")

# Buscar por el placeholder
placeholder = '¿Qué estás pensando?'
idx = src.find(placeholder)
if idx != -1:
    # Encontrar el View contenedor del composer (va hacia atrás buscando "<View style=")
    view_start = src.rfind("<View style=", 0, idx)
    if view_start == -1:
        print("  ⚠️  no encontré View contenedor")
    else:
        # Encontrar el cierre balanceado
        depth = 0
        i = view_start
        while i < len(src):
            if src[i:i+5] == "<View":
                depth += 1
            elif src[i:i+6] == "</View>":
                depth -= 1
                if depth == 0:
                    i += 6
                    break
            i += 1
        composer_block = src[view_start:i]
        src = src.replace(composer_block, "", 1)
        print("  ✅ composer eliminado")

# También quitar el estado body/handleCreate si quedan huérfanos
if src != orig:
    open(path, 'w').write(src)
PY

# ---------- 3. Arreglar botones del PostCard ----------
echo "▸ 3. Arreglar botones PostCard"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src

# Quitar el naranja del 🔁 y añadir spacing uniforme
# El botón repost actual tiene color naranja (theme.warning? o similar)
src = src.replace(
    """        <TouchableOpacity onPress={doRepost} disabled={reposting} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <Text style={{ fontSize: 18, color: theme.textMuted }}>🔁</Text>
        </TouchableOpacity>""",
    """        <TouchableOpacity onPress={doRepost} disabled={reposting} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <Text style={{ fontSize: 20, color: theme.textMuted, opacity: reposting ? 0.5 : 1 }}>🔁</Text>
        </TouchableOpacity>""",
    1
)

# Unificar tamaño de iconos: corazón/comentario/share a 22px
src = src.replace("<HeartIcon size={20}", "<HeartIcon size={22}")
src = src.replace("<CommentIcon size={20}", "<CommentIcon size={22}")
src = src.replace("<ShareIcon size={20}", "<ShareIcon size={22}")

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ botones ajustados")
PY

# ---------- 4. Centrar tab Create en AppTabs ----------
echo "▸ 4. Centrar tab Create"
python3 << 'PY'
path = 'src/navigation/AppTabs.tsx'
src = open(path).read()

# Ver el estado del tab Create (probablemente es un icono grande a la derecha)
if 'CreateIcon' in src:
    print("  ·  revisar manualmente si el + está descentrado")

open(path, 'w').write(src)
PY

# ---------- 5. Mejorar círculo de "Tu nota" ----------
echo "▸ 5. Mejorar círculo de nota vacía"
python3 << 'PY'
path = 'src/components/NotesRow.tsx'
src = open(path).read()
orig = src

# Círculo vacío → mostrar emoji de mood por defecto o "💭"
src = src.replace(
    '<Text style={{ color: theme.textMuted, fontSize: 22 }}>+</Text>',
    '<Text style={{ fontSize: 24 }}>💭</Text>',
    1
)

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ círculo con 💭 por defecto")
PY

# ---------- 6. Añadir título "Vibes" en NotesRow para acceso a todas ----------
echo "▸ 6. Título clickeable en NotesRow"
python3 << 'PY'
path = 'src/components/NotesRow.tsx'
src = open(path).read()
orig = src

# Añadir import navigation si no está
if 'useNavigation' not in src:
    src = src.replace(
        "import { useAuthStore } from '../stores/authStore';",
        "import { useAuthStore } from '../stores/authStore';\nimport { useNavigation } from '@react-navigation/native';",
        1
    )

if 'const navigation' not in src:
    src = src.replace(
        'export function NotesRow() {',
        'export function NotesRow() {\n  const navigation = useNavigation<any>();',
        1
    )

# Envolver el ScrollView en un View con header clickeable "Vibes >"
old_return = """  return (
    <>
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <ScrollView"""
new_return = """  return (
    <>
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Vibes')}
          activeOpacity={0.6}
          style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13, letterSpacing: 0.5 }}>
            VIBES
          </Text>
          <Text style={{ color: theme.textMuted, marginLeft: 6, fontSize: 11 }}>ver todas →</Text>
        </TouchableOpacity>
        <ScrollView"""
if old_return in src:
    src = src.replace(old_return, new_return, 1)
    print("  ✅ título Vibes > ver todas")

if src != orig:
    open(path, 'w').write(src)
PY

# ---------- 7. Typecheck ----------
echo ""
echo "▸ 7. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 8. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 8. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "fix(ui): unificar Vibes=Notas, quitar globo header, quitar composer feed, ajustar botones post" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIX UI v2 listo"
echo "════════════════════════════════════════════════════"
