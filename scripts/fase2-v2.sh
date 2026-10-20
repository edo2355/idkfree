#!/data/data/com.termux/files/usr/bin/bash
# FASE 2 v2 — HeaderBar rewrite + PostCard edge-to-edge
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 2 v2 — HeaderBar + PostCard"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. HeaderBar completo (rewrite) ----------
echo "▸ 1. Reescribiendo HeaderBar.tsx (logo centrado + ⚙️ izq)"
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
      {/* Izquierda: back o engranaje */}
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      )}

      {/* Centro: logo o título */}
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

      {/* Derecha: chat + notif + avatar */}
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

# ---------- 2. PostCard: contenedor edge-to-edge ----------
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
    print("  ⚠️  patrón no encontrado, saltado")
PY

echo ""
echo "▸ 3. Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then echo "  ✅ TSC limpio"; else echo "  ❌ TSC con errores"; exit 1; fi

echo ""
echo "▸ 4. Commit + push"
cd ~/idkfree
git add -A
git commit -m "feat(ui): HeaderBar con logo centrado + ⚙️ + PostCard edge-to-edge (FASE 2)" 2>&1 | head -2
git push 2>&1 | tail -2

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 2 parte 1 lista"
echo "════════════════════════════════════════════════════"
