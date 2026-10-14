import { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { PostMasonry } from '../components/PostMasonry';
import { MasonrySkeleton } from '../components/Skeleton';
import { CommentsModal } from '../components/CommentsModal';
import { HeaderBar } from '../components/HeaderBar';
import { StoriesRow } from '../components/StoriesRow';
import { NotesRow } from '../components/NotesRow';
import type { Post } from '../../shared/types';
import { ScreenBackground } from '../components/ScreenBackground';

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
      <ScreenBackground variant="grid" />
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
        {loading ? (
          <MasonrySkeleton />
        ) : (
          <PostMasonry posts={posts} />
        )}
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
