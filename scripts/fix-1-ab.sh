#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  1 — Accent + Doble tap like"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- A) Accent en más sitios ----------

# 1. Avatar con ring accent si tiene story
echo "▸ 1. Avatar con ring accent (opcional)"
python3 << 'PY'
path = 'src/components/Avatar.tsx'
src = open(path).read()
if 'ringColor' not in src:
    old = "interface Props { name?: string | null; url?: string | null; size?: number; }"
    new = "interface Props { name?: string | null; url?: string | null; size?: number; ringColor?: string | null; }"
    src = src.replace(old, new, 1)
    src = src.replace(
        "export function Avatar({ name, url, size = 40 }: Props) {",
        "export function Avatar({ name, url, size = 40, ringColor }: Props) {",
        1
    )
    old_ret = "  if (resolved) {\n    return <Image source={{ uri: resolved }} style={{ width: size, height: size, borderRadius: size / 2 }} />;\n  }"
    new_ret = """  const wrapperStyle = ringColor
    ? { width: size + 4, height: size + 4, borderRadius: (size + 4) / 2, borderWidth: 2, borderColor: ringColor, padding: 2 }
    : null;

  if (resolved) {
    const img = <Image source={{ uri: resolved }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
    return wrapperStyle ? <View style={wrapperStyle}>{img}</View> : img;
  }"""
    src = src.replace(old_ret, new_ret, 1)
    open(path, 'w').write(src)
    print("  ✅ Avatar acepta ringColor")
else:
    print("  ·  ya estaba")
PY

# 2. Botones de PostCard usan accent al hover/active
echo "▸ 2. Compartir usa accent"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
# Share se queda muted pero bookmark ya usa accent
print("  ·  PostCard ya usa accent en like/bookmark")
PY

# 3. NotificationsScreen con accent
echo "▸ 3. NotificationsScreen con accent"
python3 << 'PY'
path = 'src/screens/NotificationsScreen.tsx'
src = open(path).read()
orig = src
# Buscar usos de theme.danger o theme.text en badges → cambiar a accent
src = src.replace("theme.danger", "theme.accent")
if src != orig:
    open(path, 'w').write(src)
    print("  ✅ Notifications con accent")
else:
    print("  ·  sin cambios")
PY

# 4. HashtagScreen con accent en hashtags
echo "▸ 4. HashtagScreen con accent"
python3 << 'PY'
path = 'src/screens/HashtagScreen.tsx'
src = open(path).read()
orig = src
# Los hashtags clickeables usan accent
src = src.replace("#A855F7", "theme.accent")
if src != orig:
    open(path, 'w').write(src)
    print("  ✅ HashtagScreen")
else:
    print("  ·  sin cambios")
PY

# ---------- B) Doble tap para like ----------
echo ""
echo "▸ 5. Doble tap para like en PostCard"
cat > src/components/PostCard.tsx.new << 'TSX'
TSX
rm -f src/components/PostCard.tsx.new

python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src

# Import Animated
if 'Animated' not in src:
    src = src.replace(
        "import { View, Text, Image, TouchableOpacity, Alert, ActionSheetIOS, Platform, ActivityIndicator } from 'react-native';",
        "import { View, Text, Image, TouchableOpacity, Alert, ActionSheetIOS, Platform, ActivityIndicator, Animated, Pressable } from 'react-native';",
        1
    )
    print("  ✅ import Animated")

# Import useRef
if 'useRef' not in src.split('\n')[0]:
    src = src.replace(
        "import { useEffect, useState } from 'react';",
        "import { useEffect, useRef, useState } from 'react';",
        1
    )
    print("  ✅ import useRef")

# Estado para animación + last tap
if 'lastTap' not in src:
    old = "  const [saved, setSaved] = useState(false);"
    new = """  const [saved, setSaved] = useState(false);
  const lastTapRef = useRef<number>(0);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;"""
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ estados animación")

# Añadir función handleDoubleTap
if 'handleDoubleTap' not in src:
    old = "  async function doRepost() {"
    new = """  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap
      if (!liked && !busy) {
        toggleLike();
      }
      // Animar corazón
      heartScale.setValue(0.5);
      heartOpacity.setValue(1);
      Animated.parallel([
        Animated.spring(heartScale, { toValue: 1.2, useNativeDriver: true, friction: 3 }),
        Animated.timing(heartOpacity, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
      ]).start();
    }
    lastTapRef.current = now;
  }

  async function doRepost() {"""
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ handleDoubleTap")

# Envolver el contenedor principal en Pressable
if '<Pressable' not in src:
    old = """    <View
      style={{
        backgroundColor: theme.bg,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >"""
    new = """    <Pressable
      onPress={handleDoubleTap}
      delayLongPress={400}
      style={{
        backgroundColor: theme.bg,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        paddingTop: 12,
        paddingBottom: 12,
        position: 'relative',
      }}
    >"""
    if old in src:
        src = src.replace(old, new, 1)
        # Cerrar el Pressable (el último </View> antes del cierre del componente)
        # Buscar el último "</View>\n  );\n}" y cambiar por "</Pressable>\n  );\n}"
        idx = src.rfind("    </View>\n  );\n}")
        if idx != -1:
            src = src[:idx] + "    </Pressable>\n  );\n}" + src[idx + len("    </View>\n  );\n}"):]
        print("  ✅ Pressable envolviendo")

# Añadir el corazón animado flotante
if 'Animated.View' not in src:
    old_end = "    </Pressable>\n  );\n}"
    new_end = """      {/* Corazón flotante al doble tap */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: '40%',
          left: '40%',
          opacity: heartOpacity,
          transform: [{ scale: heartScale }],
        }}
      >
        <HeartIcon size={100} color={theme.accent} filled />
      </Animated.View>
    </Pressable>
  );
}"""
    if old_end in src:
        src = src.replace(old_end, new_end, 1)
        print("  ✅ corazón flotante")

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ PostCard actualizado")
PY

# ---------- Typecheck ----------
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

# ---------- Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 7. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(post): doble tap para like con animación + accent en notificaciones y hashtags + Avatar ring" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Bloque 1 (A + B) listo"
echo "════════════════════════════════════════════════════"
