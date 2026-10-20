#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  SEARCH con masonry + tabs + sugerencias"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. PostMasonry.tsx ----------
echo "▸ 1. PostMasonry.tsx"
cat > src/components/PostMasonry.tsx << 'TSX'
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { resolveAssetUrl } from '../utils/assetUrl';
import { Avatar } from './Avatar';

const { width: SCREEN_W } = Dimensions.get('window');
const GAP = 6;
const PAD = 8;
const COL_W = (SCREEN_W - PAD * 2 - GAP) / 2;

interface Props {
  posts: any[];
  onEndReached?: () => void;
}

function splitColumns(posts: any[]): { left: any[]; right: any[] } {
  const left: any[] = [];
  const right: any[] = [];
  let lh = 0;
  let rh = 0;
  for (const p of posts) {
    // altura estimada
    const hasImage = !!p.image_url || !!p.video_url;
    const h = hasImage ? 1.2 : 0.5;
    if (lh <= rh) { left.push(p); lh += h; }
    else { right.push(p); rh += h; }
  }
  return { left, right };
}

function MasonryCard({ post }: { post: any }) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const u = await resolveAssetUrl(post.image_url);
      setUri(u);
    })();
  }, [post.image_url]);

  const hasImage = !!uri;
  const isVideo = !!post.video_url;

  if (hasImage) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('UserProfile', { alias: post.author_alias })}
        style={{
          width: COL_W,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          position: 'relative',
        }}
      >
        <Image
          source={{ uri: uri ?? undefined }}
          style={{ width: '100%', aspectRatio: 0.75 }}
          resizeMode="cover"
        />
        {isVideo ? (
          <View style={{ position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ color: '#FFF', fontSize: 10 }}>▶</Text>
          </View>
        ) : null}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 6, backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <Text style={{ color: '#FFF', fontSize: 10, fontFamily: fonts.medium }} numberOfLines={1}>
            @{post.author_alias}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('UserProfile', { alias: post.author_alias })}
      style={{
        width: COL_W,
        borderRadius: 8,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        padding: 10,
      }}
    >
      <Text
        style={{ color: theme.text, fontSize: 12, lineHeight: 16, fontFamily: fonts.regular }}
        numberOfLines={6}
      >
        {post.body ?? ''}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <Avatar name={post.author_name ?? post.author_alias} url={post.author_avatar} size={16} />
        <Text style={{ color: theme.textMuted, fontSize: 10, fontFamily: fonts.regular }} numberOfLines={1}>
          @{post.author_alias}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function PostMasonry({ posts, onEndReached }: Props) {
  const theme = useTheme();
  const { left, right } = splitColumns(posts);

  if (posts.length === 0) return null;

  return (
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
  );
}
TSX
echo "  ✅ PostMasonry.tsx"

# ---------- 2. SearchScreen.tsx rediseñado ----------
echo "▸ 2. SearchScreen rediseñado"
cat > src/screens/SearchScreen.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Avatar } from '../components/Avatar';
import { SearchIcon } from '../components/icons/SearchIcon';
import { HeaderBar } from '../components/HeaderBar';
import { PostMasonry } from '../components/PostMasonry';

type Tab = 'personas' | 'posts';

export function SearchScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('personas');
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [suggestedPosts, setSuggestedPosts] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar sugerencias al abrir (sin query)
  useEffect(() => {
    (async () => {
      try {
        const [feedRes, sugRes] = await Promise.all([
          api.posts.feed({ limit: 30 }),
          api.profile.suggestions({ limit: 10 }),
        ]);
        setSuggestedPosts(feedRes.posts ?? []);
        setSuggestedUsers(sugRes.users ?? []);
      } catch {}
    })();
  }, []);

  async function handleSearch() {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const [uRes, pRes] = await Promise.all([
        api.search.users(query),
        api.search.posts(query),
      ]);
      setUsers(uRes.results ?? []);
      setPosts(pRes.results ?? []);
    } catch {}
    setLoading(false);
  }

  const showingSuggestions = query.length < 2;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar title="Buscar" />

      {/* Buscador */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar personas o posts..."
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.7}
            style={{
              width: 48, height: 48, borderRadius: 8,
              backgroundColor: theme.text,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <SearchIcon size={22} color={theme.bg} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 }}>
        {(['personas', 'posts'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            activeOpacity={0.7}
            style={{
              flex: 1, paddingVertical: 8, borderRadius: 20,
              backgroundColor: tab === t ? theme.text : theme.surface,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: tab === t ? theme.bg : theme.textMuted,
              fontFamily: fonts.medium, fontSize: 12, letterSpacing: 0.5,
            }}>
              {t === 'personas' ? 'PERSONAS' : 'POSTS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido */}
      {tab === 'personas' ? (
        <FlatList
          data={showingSuggestions ? suggestedUsers : users}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          ListHeaderComponent={
            showingSuggestions && suggestedUsers.length > 0 ? (
              <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 12 }}>
                QUIZÁS CONOZCAS
              </Text>
            ) : null
          }
          ListEmptyComponent={
            !loading && !showingSuggestions ? (
              <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 40, fontFamily: fonts.regular }}>
                Sin resultados
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('UserProfile', { alias: item.alias })}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', padding: 12,
                backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
                borderRadius: 8, marginBottom: 8,
              }}
            >
              <Avatar name={item.name ?? item.alias} url={item.avatar_url} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: '600', color: theme.text, fontFamily: fonts.medium }}>
                  {item.name ?? item.alias}
                </Text>
                <Text style={{ fontSize: 13, color: theme.textMuted, fontFamily: fonts.regular }}>
                  @{item.alias}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <PostMasonry posts={showingSuggestions ? suggestedPosts : posts} />
      )}
    </View>
  );
}
TSX
echo "  ✅ SearchScreen.tsx"

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
  git commit -m "feat(search): masonry Pinterest + tabs Personas/Posts + sugerencias cuando vacío" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ SEARCH rediseñado"
echo "════════════════════════════════════════════════════"
