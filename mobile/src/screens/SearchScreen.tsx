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
import { UserRowSkeleton, MasonrySkeleton } from '../components/Skeleton';
import { ScreenBackground } from '../components/ScreenBackground';

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
      <ScreenBackground variant="radar" />
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
      {loading && !showingSuggestions ? (
        <View style={{ paddingHorizontal: 16 }}>
          <UserRowSkeleton />
          <UserRowSkeleton />
          <UserRowSkeleton />
          <UserRowSkeleton />
        </View>
      ) : tab === 'personas' ? (
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
