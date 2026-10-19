import { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Avatar } from '../components/Avatar';
import { HeartIcon } from '../components/icons/HeartIcon';
import { CommentIcon } from '../components/icons/CommentIcon';
import { ShareIcon } from '../components/icons/ShareIcon';

type Tab = 'reels' | 'streams';

function ReelItem({ item, theme }: { item: any; theme: any }) {
  const { height } = useWindowDimensions(); // Altura exacta de la ventana
  const [liked, setLiked] = useState(item.liked_by_me ?? false);
  const [likesCount, setLikesCount] = useState(item.likes_count ?? 0);
  
  const player = useVideoPlayer(item.video_url, (p) => {
    p.loop = true;
    p.muted = false;
  });

  async function toggleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : prev - 1);
    try {
      if (nextLiked) await api.posts.like(item.id);
      else await api.posts.unlike(item.id);
    } catch {
      setLiked(!nextLiked);
    }
  }

  return (
    // Quitamos las medidas fijas y usamos flex: 1 para que se adapte al contenedor
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, backgroundColor: 'rgba(0,0,0,0.4)' }} />
      
      {/* Botones Derecha */}
      <View style={{ position: 'absolute', right: 16, bottom: 20, alignItems: 'center', gap: 20 }}>
        <View style={{ borderWidth: 2, borderColor: '#FFF', borderRadius: 30, padding: 2 }}>
          <Avatar name={item.author_name ?? item.author_alias} url={item.author_avatar} size={44} />
        </View>
        <TouchableOpacity onPress={toggleLike} style={{ alignItems: 'center' }}>
          <HeartIcon size={32} color={liked ? theme.danger : '#FFF'} filled={liked} />
          <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 12, marginTop: 4 }}>{likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <CommentIcon size={30} color="#FFF" />
          <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 12, marginTop: 4 }}>{item.comments_count ?? 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <ShareIcon size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Info Izquierda */}
      <View style={{ position: 'absolute', bottom: 20, left: 16, right: 80 }}>
        <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 16, marginBottom: 4 }}>@{item.author_alias}</Text>
        {item.body ? <Text style={{ color: '#FFF', fontFamily: fonts.regular, fontSize: 14 }} numberOfLines={3}>{item.body}</Text> : null}
      </View>
    </View>
  );
}

export function ReelsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<Tab>('reels');
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { width: SCREEN_W } = useWindowDimensions();
  const pagerRef = useRef<FlatList>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.posts.reels({ limit: 30 });
        setReels(res.reels ?? []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  function goToTab(t: Tab) {
    setTab(t);
    pagerRef.current?.scrollToOffset({ offset: t === 'reels' ? 0 : SCREEN_W, animated: true });
  }

  function onPagerScroll(e: any) {
    const x = e.nativeEvent.contentOffset.x;
    const newTab: Tab = Math.round(x / SCREEN_W) === 0 ? 'reels' : 'streams';
    if (newTab !== tab) setTab(newTab);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Tabs Superiores */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 60, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.border, zIndex: 10 }}>
        {(['reels', 'streams'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} onPress={() => goToTab(t)} style={{ paddingHorizontal: 24, paddingVertical: 6 }}>
            <Text style={{ fontSize: 14, fontFamily: fonts.medium, letterSpacing: 1, color: tab === t ? theme.text : theme.textMuted }}>
              {t === 'reels' ? 'REELS' : 'STREAMS'}
            </Text>
            {tab === t && <View style={{ height: 2, backgroundColor: theme.text, marginTop: 6, borderRadius: 1 }} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Pager Horizontal (ocupa todo el espacio restante) */}
      <FlatList
        ref={pagerRef}
        data={['reels', 'streams'] as Tab[]}
        keyExtractor={(k) => k}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onPagerScroll}
        getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W, flex: 1 }}> 
            {item === 'reels' ? (
              loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={theme.text} /></View>
              ) : (
                <FlatList
                  data={reels}
                  keyExtractor={(r) => r.id}
                  pagingEnabled
                  showsVerticalScrollIndicator={false}
                  // Al usar flex: 1 en el contenedor padre, pagingEnabled calculará bien el alto
                  ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 20 }}>Aún no hay reels</Text>
                    </View>
                  }
                  renderItem={({ item }) => <ReelItem item={item} theme={theme} />}
                />
              )
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>[LIVE]</Text>
                <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 22, textAlign: 'center', marginBottom: 8 }}>Streams en vivo</Text>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
                  Transmite en vivo a tus seguidores en tiempo real.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LiveStream', { roomName: `live-${Date.now()}` })}
                  style={{ backgroundColor: theme.danger, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }}
                >
                  <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 15 }}>Iniciar Transmisión</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
