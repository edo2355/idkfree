import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';

export function HashtagScreen() {
  const theme = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const tag: string = route.params?.tag;

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.hashtags.get(tag, { limit: 50 });
      setPosts(res.posts ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [tag]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={{ marginRight: 16 }}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
          #{tag}
        </Text>
      </View>

      {loading ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 60, fontFamily: fonts.regular }}>
              Sin posts con este hashtag
            </Text>
          }
          renderItem={({ item }) => <PostCard post={item} />}
        />
      )}
    </View>
  );
}
