import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';
import { StoriesRow } from '../components/StoriesRow';
import { CommentsModal } from '../components/CommentsModal';
import { HeaderBar } from '../components/HeaderBar';
import type { Post } from '../../shared/types';

export function FeedScreen() {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.posts.feed({ limit: 50 });
      setPosts(res.posts);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!body.trim()) return;
    setPosting(true);
    try {
      await api.posts.create({ body: body.trim(), visibility: 'followers' });
      setBody('');
      await load();
    } catch {}
    setPosting(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar />

      {/* Composer */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="¿Qué estás pensando?"
          placeholderTextColor={theme.textMuted}
          multiline
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 8,
            backgroundColor: theme.surface,
            color: theme.text,
            minHeight: 60,
            textAlignVertical: 'top',
            fontFamily: fonts.regular,
            fontSize: 15,
          }}
        />
        <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={!body.trim() || posting}
            style={{
              backgroundColor: body.trim() ? theme.text : theme.surface,
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 8,
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: body.trim() ? theme.bg : theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              {posting ? 'Publicando...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <Text style={{ textAlign: 'center', color: theme.textMuted, padding: 40, fontFamily: fonts.regular }}>
          Cargando...
        </Text>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<StoriesRow />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onComment={() => setOpenPostId(item.id)}
          />
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

      <CommentsModal
        postId={openPostId}
        visible={!!openPostId}
        onClose={() => setOpenPostId(null)}
      />
    </View>
  );
}
