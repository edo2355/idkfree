import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { MessageCircle } from 'lucide-react-native';
import { View, Text, Linking, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../stores/themeStore';
import { api } from '../api/client';
import { PostMasonry } from '../components/PostMasonry';
import { StoriesRow } from '../components/StoriesRow';
import { fonts } from '../theme/fonts';

export function FeedScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const res = await api.posts.feed({ limit: 50 });
      setPosts(res.posts ?? []);
    } catch (e: any) {
      if (e.status === 401 || (e.message && e.message.includes('No autenticado'))) {
        useAuthStore.getState().clearAuth();
      } else {
        console.log('Error cargando feed:', e);
      }
    } finally {
      setLoading(false);
    }
  }

  const token = useAuthStore((s) => s.token);
  useEffect(() => {
    if (token) load();
  }, [token]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* HUD Superior Táctico */}
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: 2 }}>IDK<Text style={{ color: theme.accent }}>FREE</Text></Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }} // Espacio para el TabBar flotante
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={theme.accent} />}
      >
        <StoriesRow />
        
        <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
          {loading ? (
            <Text style={{ color: theme.textMuted, textAlign: 'center', marginTop: 50 }}>CARGANDO_FEED...</Text>
          ) : (
            <PostMasonry posts={posts} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
