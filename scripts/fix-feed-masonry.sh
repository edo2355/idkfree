#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FEED en modo masonry permanente"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. FeedScreen solo masonry ----------
echo "▸ 1. FeedScreen con masonry permanente + Stories + Notes"
cat > src/screens/FeedScreen.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { PostMasonry } from '../components/PostMasonry';
import { CommentsModal } from '../components/CommentsModal';
import { HeaderBar } from '../components/HeaderBar';
import { StoriesRow } from '../components/StoriesRow';
import { NotesRow } from '../components/NotesRow';
import type { Post } from '../../shared/types';

export function FeedScreen() {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.posts.feed({ limit: 50 });
      setPosts(res.posts);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.text} />
        }
      >
        <StoriesRow />
        <NotesRow />
        <PostMasonry posts={posts} />
        {!loading && posts.length === 0 ? (
          <Text style={{ textAlign: 'center', color: theme.textMuted, padding: 40, fontFamily: fonts.regular }}>
            👋 Tu feed está vacío.
          </Text>
        ) : null}
      </ScrollView>

      <CommentsModal
        postId={openPostId}
        visible={!!openPostId}
        onClose={() => setOpenPostId(null)}
      />
    </View>
  );
}
TSX
echo "  ✅"

# ---------- 2. Quitar el ScrollView interno de PostMasonry ----------
echo "▸ 2. PostMasonry sin ScrollView (ahora es hijo del Feed)"
python3 << 'PY'
path = 'src/components/PostMasonry.tsx'
src = open(path).read()
orig = src

# Reemplazar ScrollView por View
old = """  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: PAD, paddingBottom: 80 }}
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        if (onEndReached && layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) {
          onEndReached();
        }
      }}
      scrollEventThrottle={400}
    >
      <View style={{ flexDirection: 'row', gap: GAP }}>
        <View style={{ flex: 1, gap: GAP }}>
          {left.map((p) => <MasonryCard key={p.id} post={p} />)}
        </View>
        <View style={{ flex: 1, gap: GAP }}>
          {right.map((p) => <MasonryCard key={p.id} post={p} />)}
        </View>
      </View>
    </ScrollView>
  );"""

new = """  return (
    <View style={{ padding: PAD }}>
      <View style={{ flexDirection: 'row', gap: GAP }}>
        <View style={{ flex: 1, gap: GAP }}>
          {left.map((p) => <MasonryCard key={p.id} post={p} />)}
        </View>
        <View style={{ flex: 1, gap: GAP }}>
          {right.map((p) => <MasonryCard key={p.id} post={p} />)}
        </View>
      </View>
    </View>
  );"""

if old in src:
    src = src.replace(old, new, 1)
    # Quitar ScrollView del import si ya no se usa
    if '<ScrollView' not in src:
        src = src.replace(
            "import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';",
            "import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';",
            1
        )
    open(path, 'w').write(src)
    print("  ✅")
else:
    print("  ⚠️  patrón ScrollView no encontrado")
PY

# ---------- 3. Quitar el doble tap en Home ----------
echo "▸ 3. Quitar doble tap en Home"
python3 << 'PY'
path = 'src/navigation/AppTabs.tsx'
src = open(path).read()
orig = src

old = """      <Tab.Screen
        name='Feed'
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          tabBarButton: (props) => {
            const lastTap = useRef<number>(0);
            const toggleFeed = useFeedStore((s) => s.toggleMode);
            return (
              <Pressable
                {...(props as any)}
                onPress={(e) => {
                  const now = Date.now();
                  if (now - lastTap.current < 300) {
                    toggleFeed();
                  } else {
                    props.onPress?.(e as any);
                  }
                  lastTap.current = now;
                }}
              />
            );
          },
        }}
      />"""

new = """      <Tab.Screen
        name='Feed'
        component={FeedScreen}
        options={{ tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} /> }}
      />"""

if old in src:
    src = src.replace(old, new, 1)
    # Quitar imports que ya no se usan
    src = src.replace("import { View, Text, Pressable } from 'react-native';\nimport { useRef } from 'react';\n", "import { View, Text } from 'react-native';\n", 1)
    src = src.replace("import { useFeedStore } from '../stores/feedStore';\n", "", 1)
    open(path, 'w').write(src)
    print("  ✅ doble tap quitado")
else:
    print("  ⚠️  patrón no encontrado")
PY

# ---------- 4. Quitar botón ▦ del HeaderBar ----------
echo "▸ 4. Quitar botón ▦ del HeaderBar"
python3 << 'PY'
path = 'src/components/HeaderBar.tsx'
src = open(path).read()
orig = src

old = """        {/* Toggle masonry solo en Feed (sin showBack, sin title) */}
        {!showBack && !title ? (
          <TouchableOpacity onPress={() => useFeedStore.getState().toggleMode()} activeOpacity={0.6}>
            <Text style={{ fontSize: 18, color: theme.text }}>▦</Text>
          </TouchableOpacity>
        ) : null}

"""
if old in src:
    src = src.replace(old, "", 1)
    # Quitar import useFeedStore si ya no se usa
    if 'useFeedStore' not in src.split('import')[3]:
        src = src.replace("import { useFeedStore } from '../stores/feedStore';\n", "", 1)
    open(path, 'w').write(src)
    print("  ✅ botón quitado")
else:
    print("  ·  ya no estaba")
PY

# ---------- 5. Typecheck ----------
echo ""
echo "▸ 5. Typecheck"
npx tsc --noEmit 2>&1 | head -12
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
  git commit -m "feat(feed): masonry Pinterest permanente (sin toggle)" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Feed en masonry permanente"
echo "════════════════════════════════════════════════════"
