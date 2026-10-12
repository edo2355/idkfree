#!/data/data/com.termux/files/usr/bin/bash
# FASE 2 — HeaderBar centrado + PostCard edge-to-edge + Feed spacing
set +e
cd ~/idkfree/mobile || exit 1
TS=$(date +%s)
BAK=~/tmp/idkfree-bak-$TS
mkdir -p "$BAK"

echo "════════════════════════════════════════════════════"
echo "  FASE 2 — UI tipo Instagram"
echo "════════════════════════════════════════════════════"
echo "  Backup: $BAK"
echo ""

cp src/components/HeaderBar.tsx "$BAK/" 2>/dev/null
cp src/components/PostCard.tsx "$BAK/" 2>/dev/null
cp src/screens/FeedScreen.tsx "$BAK/" 2>/dev/null

# ---------- 1. HeaderBar ----------
echo "▸ 1. HeaderBar: logo centrado + ⚙️ izq"
cat > src/components/HeaderBar.tsx << 'TSX'
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { NotificationIcon } from './icons/NotificationIcon';
import { CommentIcon } from './icons/CommentIcon';
import { Avatar } from './Avatar';

interface Props {
  showBack?: boolean;
  title?: string;
}

export function HeaderBar({ showBack = false, title }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        position: 'relative',
      }}
    >
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      )}

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Text
          style={{
            fontSize: 26,
            color: theme.text,
            fontFamily: fonts.displayBoldItalic,
            letterSpacing: 0.5,
          }}
        >
          {title ?? 'IDKFREE'}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.6}>
          <NotificationIcon size={22} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.6}>
          <Avatar name={user?.name ?? user?.alias} url={(user as any)?.avatar_url} size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
TSX
echo "  ✅ HeaderBar reescrito"

# ---------- 2. PostCard contenedor ----------
echo "▸ 2. PostCard: contenedor edge-to-edge"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()

old = """    <View
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >"""
new = """    <View
      style={{
        backgroundColor: theme.bg,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >"""
if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("  ✅ contenedor reemplazado")
else:
    print("  ⚠️  patrón no encontrado")
PY

# ---------- 3. FeedScreen: composer edge + feed spacing ----------
echo "▸ 3. FeedScreen: composer + feed spacing"
python3 << 'PY'
path = 'src/screens/FeedScreen.tsx'
src = open(path).read()
orig = src

# Composer: quitar borde lateral, solo separador abajo
src = src.replace(
    '<View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>',
    '<View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>'
)

# contentContainer: quitar padding si tiene
src = src.replace('contentContainerStyle={{ padding: 16 }}', 'contentContainerStyle={{ paddingBottom: 40 }}')
src = src.replace('contentContainerStyle={{ padding: 12 }}', 'contentContainerStyle={{ paddingBottom: 40 }}')

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ composer + contentContainer ajustados")
else:
    print("  ⚠️  sin cambios detectados")
PY

# ---------- TYPECHECK ----------
echo ""
echo "▸ 4. Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores → revirtiendo"
  cp "$BAK"/* src/components/ 2>/dev/null
  cp "$BAK"/* src/screens/ 2>/dev/null
  TSC_OK=0
fi

# ---------- COMMIT ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 5. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(ui): FASE 2 - HeaderBar centrado + PostCard edge-to-edge + Feed spacing" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  FIN FASE 2"
echo "════════════════════════════════════════════════════"
