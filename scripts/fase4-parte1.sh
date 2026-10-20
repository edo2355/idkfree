#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 4 parte 1 — Globo + limpiar composer"
echo "════════════════════════════════════════════════════"
echo ""

# 1. Globo 💭 en HeaderBar
python3 << 'PY'
path = 'src/components/HeaderBar.tsx'
src = open(path).read()
orig = src

old = """      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>"""

new = """      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Vibes')} activeOpacity={0.6}>
          <Text style={{ fontSize: 20 }}>💭</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>"""

if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("  ✅ globo 💭 añadido")
else:
    print("  ⚠️  patrón no encontrado")
PY

# 2. Quitar Vibe del composer
python3 << 'PY'
path = 'src/screens/CreateScreen.tsx'
src = open(path).read()
orig = src

old = """          <TouchableOpacity
            onPress={() => navigation.navigate('Vibes')}
            activeOpacity={0.7}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: 12,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 6 }}>✨</Text>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 12 }}>Vibe</Text>
          </TouchableOpacity>"""

if old in src:
    src = src.replace(old, '', 1)
    open(path, 'w').write(src)
    print("  ✅ botón Vibe quitado")
else:
    print("  ⚠️  no encontrado (puede que ya esté quitado)")
PY

# 3. Typecheck
echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# 4. Commit
if [ "$TSC_OK" = "1" ]; then
  echo ""
  echo "▸ Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(vibes): globo 💭 en HeaderBar + quitar Vibe del composer" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 4 parte 1 lista"
echo "════════════════════════════════════════════════════"
