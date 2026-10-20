#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  Bloque 1/6 — Long press menú en PostCard"
echo "════════════════════════════════════════════════════"
echo ""

# Copiar backup
cp src/components/PostCard.tsx ~/PostCard.bak

echo "▸ Modificando PostCard con long press"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src

# 1. Import Modal + otros si no están
if 'Modal' not in src:
    src = src.replace(
        "import { View, Text, Image, TouchableOpacity, Alert, ActionSheetIOS, Platform, ActivityIndicator, Animated, Pressable } from 'react-native';",
        "import { View, Text, Image, TouchableOpacity, Alert, ActionSheetIOS, Platform, ActivityIndicator, Animated, Pressable, Modal, Share } from 'react-native';",
        1
    )
    print("  ✅ imports")

# 2. Estado del menú long press
if 'menuOpen' not in src:
    old = "  const [saved, setSaved] = useState(false);"
    new = "  const [saved, setSaved] = useState(false);\n  const [menuOpen, setMenuOpen] = useState(false);"
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ estado menuOpen")

# 3. Función long press handler
if 'handleLongPress' not in src:
    old = "  async function doRepost() {"
    new = """  function handleLongPress() {
    setMenuOpen(true);
  }

  async function doRepost() {"""
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ handleLongPress")

# 4. Añadir onLongPress al Pressable principal
if 'onLongPress={handleLongPress}' not in src:
    old = """    <Pressable
      onPress={handleDoubleTap}
      delayLongPress={400}"""
    new = """    <Pressable
      onPress={handleDoubleTap}
      onLongPress={handleLongPress}
      delayLongPress={400}"""
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ onLongPress al Pressable")

# 5. Añadir el Modal al final del PostCard (antes de </Pressable>)
if 'MenuModal' not in src:
    old = """      {/* Corazón flotante al doble tap */}
      <Animated.View"""
    new = """      {/* Modal de long press */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 }}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={{ backgroundColor: theme.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.border, paddingVertical: 8, width: '100%', maxWidth: 320 }}>
            {/* Header */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
              <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2 }}>
                POST · {post.id.slice(0, 8).toUpperCase()}
              </Text>
              <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13, marginTop: 4 }}>
                @{post.author_alias}
              </Text>
            </View>

            {/* Opciones */}
            {[
              { icon: '🔗', label: 'Compartir', action: () => { setMenuOpen(false); if (onShare) onShare(); } },
              { icon: '📌', label: saved ? 'Quitar de guardados' : 'Guardar', action: () => { setMenuOpen(false); setSaved((s) => !s); } },
              { icon: '🔁', label: 'Repostear', action: () => { setMenuOpen(false); doRepost(); } },
              { icon: '💬', label: 'Ver comentarios', action: () => { setMenuOpen(false); if (onComment) onComment(); } },
              { icon: '📋', label: 'Copiar texto', action: () => { setMenuOpen(false); try { const Clipboard = require('expo-clipboard'); Clipboard.setStringAsync(post.body ?? ''); } catch {} } },
              ...(isMine ? [{ icon: '🗑️', label: 'Eliminar', danger: true, action: () => { setMenuOpen(false); doDelete(); } }] : []),
            ].map((opt: any, i: number) => (
              <TouchableOpacity
                key={i}
                onPress={opt.action}
                activeOpacity={0.6}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 }}
              >
                <Text style={{ fontSize: 18, marginRight: 14 }}>{opt.icon}</Text>
                <Text style={{
                  color: opt.danger ? theme.danger : theme.text,
                  fontFamily: fonts.regular,
                  fontSize: 15,
                  flex: 1,
                }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Corazón flotante al doble tap */}
      <Animated.View"""
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ modal añadido")

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ PostCard actualizado")
PY

# Typecheck
echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -12
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# Commit
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(post): long press menú (compartir/guardar/repostear/comentar/copiar/eliminar)" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  echo "⚠️  TSC falló — revirtiendo"
  cp ~/PostCard.bak ~/idkfree/mobile/src/components/PostCard.tsx
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Bloque 1/6 (Long press) listo"
echo "════════════════════════════════════════════════════"
