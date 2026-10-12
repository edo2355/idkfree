import { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';
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

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<><StoriesRow /><NotesRow /></>}
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
