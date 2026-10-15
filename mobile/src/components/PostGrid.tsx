import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { resolveAssetUrl } from '../utils/assetUrl';

const { width: SCREEN_W } = Dimensions.get('window');
const GAP = 2;
const SIZE = (SCREEN_W - GAP * 2) / 3;

interface Props {
  posts: any[];
}

function GridCell({ post }: { post: any }) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const u = await resolveAssetUrl(post.image_url);
      setUri(u);
    })();
  }, [post.image_url]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('UserProfile', { alias: post.author_alias })}
      style={{ width: SIZE, height: SIZE, backgroundColor: theme.surface }}
    >
      {uri ? (
        <Image source={{ uri: uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <View style={{ flex: 1, padding: 6, justifyContent: 'space-between' }}>
          <Text style={{ color: theme.text, fontSize: 10, lineHeight: 13 }} numberOfLines={4}>
            {post.body ?? ''}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 8 }} numberOfLines={1}>
            @{post.author_alias}
          </Text>
        </View>
      )}
      {post.video_url ? (
        <View style={{ position: 'absolute', top: 4, right: 4 }}>
          <Text style={{ color: '#FFF', fontSize: 12 }}>▶</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export function PostGrid({ posts }: Props) {
  const theme = useTheme();

  if (posts.length === 0) {
    return (
      <View style={{ paddingVertical: 60, alignItems: 'center' }}>
        <Text style={{ fontSize: 32, marginBottom: 8 }}>[CAM]</Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13 }}>
          Sin posts todavía
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
      {posts.map((p) => <GridCell key={p.id} post={p} />)}
    </View>
  );
}
