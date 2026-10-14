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
