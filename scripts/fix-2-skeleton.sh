#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  Bloque 2 — G: Skeletons con shimmer"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Skeleton base con shimmer ----------
echo "▸ 1. Skeleton.tsx"
cat > src/components/Skeleton.tsx << 'TSX'
import { useEffect, useRef } from 'react';
import { View, Animated, type ViewStyle } from 'react-native';
import { useTheme } from '../stores/themeStore';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: Props) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.surfaceElevated,
          opacity,
        },
        style,
      ]}
    />
  );
}

// ---------- Skeleton para PostCard ----------
export function PostSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
        <Skeleton width={36} height={36} borderRadius={18} />
        <View style={{ marginLeft: 10, flex: 1, gap: 6 }}>
          <Skeleton width={80} height={12} />
          <Skeleton width={120} height={10} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, gap: 8, marginBottom: 12 }}>
        <Skeleton width="90%" height={12} />
        <Skeleton width="70%" height={12} />
      </View>
      <Skeleton width="100%" height={200} borderRadius={0} />
    </View>
  );
}

// ---------- Skeleton para Masonry ----------
export function MasonrySkeleton() {
  const heights = [220, 140, 180, 260, 120, 200, 160, 240];
  return (
    <View style={{ flexDirection: 'row', gap: 6, padding: 8 }}>
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="100%" height={heights[0]} borderRadius={8} />
        <Skeleton width="100%" height={heights[1]} borderRadius={8} />
        <Skeleton width="100%" height={heights[2]} borderRadius={8} />
        <Skeleton width="100%" height={heights[3]} borderRadius={8} />
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="100%" height={heights[4]} borderRadius={8} />
        <Skeleton width="100%" height={heights[5]} borderRadius={8} />
        <Skeleton width="100%" height={heights[6]} borderRadius={8} />
        <Skeleton width="100%" height={heights[7]} borderRadius={8} />
      </View>
    </View>
  );
}

// ---------- Skeleton para lista de personas ----------
export function UserRowSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 8, marginBottom: 8 }}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={10} />
      </View>
    </View>
  );
}

// ---------- Skeleton para conversaciones ----------
export function ChatRowSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
        <Skeleton width={120} height={12} />
        <Skeleton width="80%" height={10} />
      </View>
    </View>
  );
}

// ---------- Skeleton para notificaciones ----------
export function NotificationSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: theme.surface, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: theme.border }}>
      <Skeleton width={36} height={36} borderRadius={18} />
      <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
        <Skeleton width="70%" height={12} />
        <Skeleton width={60} height={10} />
      </View>
    </View>
  );
}
TSX
echo "  ✅"

# ---------- 2. FeedScreen usa MasonrySkeleton ----------
echo "▸ 2. FeedScreen usa skeleton"
python3 << 'PY'
path = 'src/screens/FeedScreen.tsx'
src = open(path).read()
orig = src

if 'MasonrySkeleton' not in src:
    src = src.replace(
        "import { PostMasonry } from '../components/PostMasonry';",
        "import { PostMasonry } from '../components/PostMasonry';\nimport { MasonrySkeleton } from '../components/Skeleton';",
        1
    )
    old = "        <PostMasonry posts={posts} />"
    new = """        {loading ? (
          <MasonrySkeleton />
        ) : (
          <PostMasonry posts={posts} />
        )}"""
    if old in src:
        src = src.replace(old, new, 1)
        open(path, 'w').write(src)
        print("  ✅ Feed usa MasonrySkeleton")
    else:
        print("  ⚠️  no encontré PostMasonry en Feed")
else:
    print("  ·  ya estaba")
PY

# ---------- 3. ProfileScreen usa grid skeleton ----------
echo "▸ 3. ProfileScreen skeleton de grid"
python3 << 'PY'
path = 'src/screens/ProfileScreen.tsx'
src = open(path).read()
orig = src

if 'Skeleton' not in src:
    src = src.replace(
        "import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';",
        "import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';\nimport { Skeleton } from '../components/Skeleton';",
        1
    )
    print("  ✅ import")

# Reemplazar el ActivityIndicator por skeleton completo
old = """  if (loading || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }"""

new = """  if (loading || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 8 }}>
          <Skeleton width={100} height={24} />
        </View>
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Skeleton width={96} height={96} borderRadius={48} />
          <Skeleton width={120} height={18} style={{ marginTop: 12 }} />
          <Skeleton width={80} height={14} style={{ marginTop: 6 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 32 }}>
          <Skeleton width={60} height={40} borderRadius={8} />
          <Skeleton width={60} height={40} borderRadius={8} />
          <Skeleton width={60} height={40} borderRadius={8} />
        </View>
        <View style={{ paddingHorizontal: 32, marginTop: 20 }}>
          <Skeleton width="100%" height={44} borderRadius={8} />
        </View>
        <View style={{ flexDirection: 'row', gap: 2, marginTop: 24, paddingHorizontal: 2 }}>
          <View style={{ flex: 1 }}><Skeleton width="100%" height={100} borderRadius={2} /></View>
          <View style={{ flex: 1 }}><Skeleton width="100%" height={100} borderRadius={2} /></View>
          <View style={{ flex: 1 }}><Skeleton width="100%" height={100} borderRadius={2} /></View>
        </View>
      </View>
    );
  }"""

if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("  ✅ skeleton de perfil")
else:
    print("  ⚠️  patrón loading no encontrado")
PY

# ---------- 4. SearchScreen usa UserRowSkeleton ----------
echo "▸ 4. SearchScreen skeleton"
python3 << 'PY'
path = 'src/screens/SearchScreen.tsx'
src = open(path).read()

if 'UserRowSkeleton' not in src:
    src = src.replace(
        "import { PostMasonry } from '../components/PostMasonry';",
        "import { PostMasonry } from '../components/PostMasonry';\nimport { UserRowSkeleton, MasonrySkeleton } from '../components/Skeleton';",
        1
    )
    # Reemplazar el FlatList por uno con skeleton en loading
    old = """      {tab === 'personas' ? (
        <FlatList
          data={showingSuggestions ? suggestedUsers : users}"""
    new = """      {loading && !showingSuggestions ? (
        <View style={{ paddingHorizontal: 16 }}>
          <UserRowSkeleton />
          <UserRowSkeleton />
          <UserRowSkeleton />
          <UserRowSkeleton />
        </View>
      ) : tab === 'personas' ? (
        <FlatList
          data={showingSuggestions ? suggestedUsers : users}"""
    if old in src:
        src = src.replace(old, new, 1)
        open(path, 'w').write(src)
        print("  ✅ skeleton Search")
    else:
        print("  ⚠️  no encontré el FlatList de personas")
else:
    print("  ·  ya estaba")
PY

# ---------- 5. ChatsScreen skeleton ----------
echo "▸ 5. ChatsScreen skeleton"
python3 << 'PY'
path = 'src/screens/ChatsScreen.tsx'
src = open(path).read()

if 'ChatRowSkeleton' not in src:
    if 'NotesRow' in src:
        src = src.replace(
            "import { NotesRow } from '../components/NotesRow';",
            "import { NotesRow } from '../components/NotesRow';\nimport { ChatRowSkeleton } from '../components/Skeleton';",
            1
        )
        # Cambiar el ActivityIndicator de loading por ChatRowSkeleton
        old = """      {loading ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : ("""
        new = """      {loading ? (
        <View style={{ paddingHorizontal: 16 }}>
          <ChatRowSkeleton />
          <ChatRowSkeleton />
          <ChatRowSkeleton />
          <ChatRowSkeleton />
        </View>
      ) : ("""
        if old in src:
            src = src.replace(old, new, 1)
            open(path, 'w').write(src)
            print("  ✅ skeleton Chats")
        else:
            print("  ⚠️  patrón loading no encontrado")
    else:
        print("  ⚠️  NotesRow no está en ChatsScreen")
else:
    print("  ·  ya estaba")
PY

# ---------- 6. NotificationsScreen skeleton ----------
echo "▸ 6. NotificationsScreen skeleton"
python3 << 'PY'
path = 'src/screens/NotificationsScreen.tsx'
src = open(path).read()

if 'NotificationSkeleton' not in src:
    # Insertar import después del último import de componentes
    import re
    matches = list(re.finditer(r"import \{ [^}]+\} from '\.\./components/[^']+';", src))
    if matches:
        last = matches[-1]
        src = src[:last.end()] + "\nimport { NotificationSkeleton } from '../components/Skeleton';" + src[last.end():]
        print("  ✅ import")

    # Buscar el loading y reemplazar
    # Es un patrón común: if (loading) return <ActivityIndicator />
    old_patterns = [
        ("""    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );""",
         """    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, padding: 16, paddingTop: 60 }}>
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
      </View>
    );"""),
    ]

    done = False
    for old, new in old_patterns:
        if old in src:
            src = src.replace(old, new, 1)
            done = True
            break

    if done:
        open(path, 'w').write(src)
        print("  ✅ skeleton Notifications")
    else:
        print("  ⚠️  patrón loading no encontrado")
else:
    print("  ·  ya estaba")
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
  git commit -m "feat(ui): skeleton loaders con shimmer (Feed, Perfil, Search, Chats, Notif)" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Bloque 2 (G: Skeletons) listo"
echo "════════════════════════════════════════════════════"
