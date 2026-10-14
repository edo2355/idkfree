#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX — Chat: ver perfil + Feed: toggle masonry"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. ChatScreen: avatar/nombre → UserProfile ----------
echo "▸ 1. ChatScreen: header clickeable"
python3 << 'PY'
path = 'src/screens/ChatScreen.tsx'
src = open(path).read()
orig = src

old_header = """        <Avatar name={other.name ?? other.alias} url={other.avatar_url} size={36} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>
            {other.name ?? other.alias}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12 }}>
            @{other.alias}
          </Text>
        </View>"""

new_header = """        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', { alias: other.alias })}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        >
          <Avatar name={other.name ?? other.alias} url={other.avatar_url} size={36} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>
              {other.name ?? other.alias}
            </Text>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12 }}>
              @{other.alias}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón ver perfil (opcional, redundante con el tap) */}
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', { alias: other.alias })}
          activeOpacity={0.6}
          style={{ padding: 8 }}
        >
          <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 12 }}>
            Perfil
          </Text>
        </TouchableOpacity>"""

if old_header in src:
    src = src.replace(old_header, new_header, 1)
    open(path, 'w').write(src)
    print("  ✅ ChatScreen header clickeable")
else:
    print("  ⚠️  patrón no encontrado")
PY

# ---------- 2. HeaderBar con botón toggle masonry (solo en Feed) ----------
echo ""
echo "▸ 2. HeaderBar: botón toggle masonry (solo cuando no es back/title)"
python3 << 'PY'
path = 'src/components/HeaderBar.tsx'
src = open(path).read()
orig = src

# Import useFeedStore
if 'useFeedStore' not in src:
    src = src.replace(
        "import { useAuthStore } from '../stores/authStore';",
        "import { useAuthStore } from '../stores/authStore';\nimport { useFeedStore } from '../stores/feedStore';",
        1
    )
    print("  ✅ import useFeedStore")

# Añadir el toggle cuando es el Feed (sin showBack y sin title específico)
old_right = """      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>"""

new_right = """      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {/* Toggle masonry solo en Feed (sin showBack, sin title) */}
        {!showBack && !title ? (
          <TouchableOpacity onPress={() => useFeedStore.getState().toggleMode()} activeOpacity={0.6}>
            <Text style={{ fontSize: 18, color: theme.text }}>▦</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>"""

if old_right in src:
    src = src.replace(old_right, new_right, 1)
    open(path, 'w').write(src)
    print("  ✅ botón toggle ▦ añadido")
else:
    print("  ⚠️  patrón right no encontrado")
PY

# ---------- 3. Typecheck ----------
echo ""
echo "▸ 3. Typecheck"
npx tsc --noEmit 2>&1 | head -12
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
  git commit -m "feat: ChatScreen header clickeable + HeaderBar botón toggle masonry" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Listo"
echo "════════════════════════════════════════════════════"
