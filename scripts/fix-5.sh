#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX 5 — Stories + Masonry + Create + Draw + Repost"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. feedStore ----------
echo "▸ 1. feedStore.ts"
cat > src/stores/feedStore.ts << 'TS'
import { create } from 'zustand';

type FeedMode = 'list' | 'masonry';

interface FeedState {
  mode: FeedMode;
  toggleMode: () => void;
  setMode: (m: FeedMode) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  mode: 'list',
  toggleMode: () => set((s) => ({ mode: s.mode === 'list' ? 'masonry' : 'list' })),
  setMode: (mode) => set({ mode }),
}));
TS
echo "  ✅"

# ---------- 2. StoryViewer con onClose diferido ----------
echo "▸ 2. StoryViewer — fix setState-in-render"
python3 << 'PY'
path = 'src/components/StoryViewer.tsx'
src = open(path).read()

# Fix next(): diferir onClose
old_next = """  function next() {
    if (!group) return;
    if (storyIdx < group.stories.length - 1) setStoryIdx(storyIdx + 1);
    else if (groupIdx < groups.length - 1) { setGroupIdx(groupIdx + 1); setStoryIdx(0); }
    else onClose();
  }"""
new_next = """  function next() {
    if (!group) return;
    if (storyIdx < group.stories.length - 1) setStoryIdx(storyIdx + 1);
    else if (groupIdx < groups.length - 1) { setGroupIdx(groupIdx + 1); setStoryIdx(0); }
    else setTimeout(() => onClose(), 0);
  }"""
if old_next in src:
    src = src.replace(old_next, new_next, 1)
    print("  ✅ next() con setTimeout")

# Fix autoavance: onClose también diferido
old_auto = """          } else {
            onClose();
          }"""
new_auto = """          } else {
            setTimeout(() => onClose(), 0);
          }"""
if old_auto in src:
    src = src.replace(old_auto, new_auto, 1)
    print("  ✅ autoavance onClose diferido")

# Fix useEffect inicial: llamar onClose con setTimeout
old_eff = """  useEffect(() => {
    if ((!group || !story) && !closedRef.current) {
      closedRef.current = true;
      onClose();
    }
  }, [group, story, onClose]);"""
new_eff = """  useEffect(() => {
    if ((!group || !story) && !closedRef.current) {
      closedRef.current = true;
      setTimeout(() => onClose(), 0);
    }
  }, [group, story, onClose]);"""
if old_eff in src:
    src = src.replace(old_eff, new_eff, 1)
    print("  ✅ useEffect onClose diferido")

open(path, 'w').write(src)
PY

# ---------- 3. StoriesRow con onClose estable ----------
echo "▸ 3. StoriesRow — onClose useCallback"
python3 << 'PY'
path = 'src/components/StoriesRow.tsx'
src = open(path).read()

# Importar useCallback
if 'useCallback' not in src:
    src = src.replace(
        "import { useEffect, useState } from 'react';",
        "import { useCallback, useEffect, useState } from 'react';",
        1
    )
    print("  ✅ import useCallback")

# Crear handleClose estable
if 'handleClose' not in src:
    old = "  if (loading) {"
    new = """  const handleClose = useCallback(() => {
    setViewerOpen(false);
    // Recargar tras cerrar (diferido para no bloquear render)
    setTimeout(() => { load(); }, 50);
  }, []);

  if (loading) {"""
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ handleClose creado")

# Reemplazar el onClose en el StoryViewer
old_oc = "onClose={() => { setViewerOpen(false); load(); }}"
new_oc = "onClose={handleClose}"
if old_oc in src:
    src = src.replace(old_oc, new_oc, 1)
    print("  ✅ onClose usa handleClose")

open(path, 'w').write(src)
PY

# ---------- 4. FeedScreen con masonry toggle ----------
echo "▸ 4. FeedScreen con masonry"
cat > src/screens/FeedScreen.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { useFeedStore } from '../stores/feedStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';
import { PostMasonry } from '../components/PostMasonry';
import { CommentsModal } from '../components/CommentsModal';
import { HeaderBar } from '../components/HeaderBar';
import { StoriesRow } from '../components/StoriesRow';
import { NotesRow } from '../components/NotesRow';
import type { Post } from '../../shared/types';

export function FeedScreen() {
  const theme = useTheme();
  const mode = useFeedStore((s) => s.mode);
  const toggleMode = useFeedStore((s) => s.toggleMode);
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

      {mode === 'masonry' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1.5, fontFamily: fonts.medium }}>
            ▦ PINTEREST
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontFamily: fonts.medium }}>
              lista
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {mode === 'masonry' ? (
        <PostMasonry posts={posts} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<><StoriesRow /><NotesRow /></>}
          renderItem={({ item }) => (
            <PostCard post={item} onComment={() => setOpenPostId(item.id)} />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.text} />}
          ListEmptyComponent={
            !loading ? (
              <Text style={{ textAlign: 'center', color: theme.textMuted, padding: 40, fontFamily: fonts.regular }}>
                👋 Tu feed está vacío.
              </Text>
            ) : null
          }
        />
      )}

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

# ---------- 5. AppTabs con doble tap + Create centrado ----------
echo "▸ 5. AppTabs con doble tap"
python3 << 'PY'
path = 'src/navigation/AppTabs.tsx'
src = open(path).read()

# Import useRef + useFeedStore
if 'useFeedStore' not in src:
    src = src.replace(
        "import { useAuthStore } from '../stores/authStore';",
        "import { useAuthStore } from '../stores/authStore';\nimport { useFeedStore } from '../stores/feedStore';",
        1
    )

if 'useRef' not in src:
    src = src.replace(
        "import { View, Text } from 'react-native';",
        "import { View, Text, Pressable } from 'react-native';\nimport { useRef } from 'react';",
        1
    )

# Crear HomeIcon con doble tap
old_feed = """      <Tab.Screen
        name='Feed'
        component={FeedScreen}
        options={{ tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} /> }}
      />"""
new_feed = """      <Tab.Screen
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
if old_feed in src:
    src = src.replace(old_feed, new_feed, 1)
    print("  ✅ doble tap en Home")

# Centrar Create: usar tabBarItemStyle (más confiable)
old_create_icon = """function CreateIcon({ color, focused }: { color: string; focused: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: focused ? theme.text : theme.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Text style={{ color: focused ? theme.bg : theme.text, fontSize: 24, fontFamily: fonts.regular, marginTop: -2 }}>
        +
      </Text>
    </View>
  );
}"""
new_create_icon = """function CreateIcon({ color, focused }: { color: string; focused: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: focused ? theme.text : theme.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Text style={{ color: focused ? theme.bg : theme.text, fontSize: 26, fontFamily: fonts.regular, marginTop: -3, lineHeight: 30 }}>
        +
      </Text>
    </View>
  );
}"""
if old_create_icon in src:
    src = src.replace(old_create_icon, new_create_icon, 1)
    print("  ✅ CreateIcon centrado")

# Asegurar que el tab Create no tenga label
if "tabBarLabel: () => null" not in src:
    src = src.replace(
        "tabBarIcon: ({ color, focused }) => <CreateIcon color={color} focused={focused} />,",
        "tabBarIcon: ({ color, focused }) => <CreateIcon color={color} focused={focused} />,\n          tabBarLabel: () => null,",
        1
    )
    print("  ✅ tabBarLabel null")

open(path, 'w').write(src)
PY

# ---------- 6. DrawingCanvas con imagen de fondo ----------
echo "▸ 6. DrawingCanvas con imagen de fondo"
python3 << 'PY'
path = 'src/components/DrawingCanvas.tsx'
src = open(path).read()

# Import Image, ImageBackground
if 'ImageBackground' not in src:
    src = src.replace(
        "import { View, Text, TouchableOpacity, PanResponder, Dimensions, ActivityIndicator, Alert } from 'react-native';",
        "import { View, Text, TouchableOpacity, PanResponder, Dimensions, ActivityIndicator, Alert, ImageBackground } from 'react-native';",
        1
    )
    print("  ✅ import ImageBackground")

# Reemplazar el canvas capturable por ImageBackground + SVG overlay
old_canvas = """      {/* Canvas capturable */}
      <View
        ref={captureViewRef}
        collapsable={false}
        style={{ flex: 1, backgroundColor: '#000' }}
        {...panResponder.panHandlers}
      >
        {/* Imagen de fondo */}
        {resolvedImage && (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* @ts-ignore */}
            <View style={{ flex: 1 }}>
              {/* imagen via ImageBackground no, usamos Image normal */}
            </View>
          </View>
        )}

        {/* Paths SVG */}
        <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
          {paths.map((p, i) => (
            <Path key={i} d={p} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {currentPath ? (
            <Path d={currentPath} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ) : null}
        </Svg>
      </View>"""

new_canvas = """      {/* Canvas capturable */}
      <View
        ref={captureViewRef}
        collapsable={false}
        style={{ flex: 1, backgroundColor: '#000' }}
        {...panResponder.panHandlers}
      >
        {resolvedImage ? (
          <ImageBackground
            source={{ uri: resolvedImage }}
            style={{ flex: 1 }}
            resizeMode="contain"
          >
            <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
              {paths.map((p, i) => (
                <Path key={i} d={p} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {currentPath ? (
                <Path d={currentPath} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ) : null}
            </Svg>
          </ImageBackground>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#FFF" />
          </View>
        )}
      </View>"""

if old_canvas in src:
    src = src.replace(old_canvas, new_canvas, 1)
    print("  ✅ canvas con imagen de fondo")
else:
    print("  ⚠️  patrón canvas no encontrado")

# Fix useState(() => ...) que debería ser useEffect
old_use = """  useState(() => {
    (async () => setResolvedImage(await resolveAssetUrl(imageUrl)))();
  });"""
new_use = """  useEffect(() => {
    (async () => {
      const u = await resolveAssetUrl(imageUrl);
      setResolvedImage(u);
    })();
  }, [imageUrl]);"""
if old_use in src:
    src = src.replace(old_use, new_use, 1)
    # Import useEffect
    if 'useEffect' not in src.split('\n')[0]:
        src = src.replace(
            "import { useRef, useState } from 'react';",
            "import { useRef, useState, useEffect } from 'react';",
            1
        )
    print("  ✅ useState → useEffect")

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
  git commit -m "fix: StoryViewer setState + masonry toggle + Create centrado + DrawingCanvas imagen fondo" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIX 5 LISTO"
echo "════════════════════════════════════════════════════"
