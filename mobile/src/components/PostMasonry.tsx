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
