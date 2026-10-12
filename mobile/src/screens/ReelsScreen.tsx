import { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { useVideoPlayer, VideoView } from 'expo-video';
import { resolveAssetUrl } from '../utils/assetUrl';
import { HeaderBar } from '../components/HeaderBar';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type Tab = 'reels' | 'streams';

function VideoPlayer({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = false;
    p.play();
  });
  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

function ReelItem({ item, theme, fonts, height }: { item: any; theme: any; fonts: any; height: number }) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await resolveAssetUrl(item.video_url);
      if (!cancelled) setUri(resolved);
    })();
    return () => { cancelled = true; };
  }, [item.video_url]);

  return (
    <View style={{ height, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
      <View
        style={{
          width: '100%',
          aspectRatio: 9 / 16,
          maxHeight: '82%',
          backgroundColor: '#000',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.border,
          overflow: 'hidden',
        }}
      >
        {uri ? (
          <VideoPlayer uri={uri} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#FFF" />
          </View>
        )}
      </View>

      <View style={{ marginTop: 12, alignItems: 'center' }}>
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15, marginBottom: 4 }}>
          @{item.author_alias}
        </Text>
        {item.body ? (
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center' }}>
            {item.body}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function ReelsScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState<Tab>('reels');
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pagerRef = useRef<FlatList>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.posts.reels({ limit: 30 });
      setReels(res.reels ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function goToTab(t: Tab) {
    setTab(t);
    pagerRef.current?.scrollToOffset({
      offset: t === 'reels' ? 0 : SCREEN_W,
      animated: true,
    });
  }

  function onPagerScroll(e: any) {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SCREEN_W);
    const newTab: Tab = idx === 0 ? 'reels' : 'streams';
    if (newTab !== tab) setTab(newTab);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar />

      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        {(['reels', 'streams'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => goToTab(t)}
            activeOpacity={0.7}
            style={{ paddingHorizontal: 24, paddingVertical: 6 }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                letterSpacing: 1,
                color: tab === t ? theme.text : theme.textMuted,
              }}
            >
              {t === 'reels' ? 'REELS' : 'STREAMS'}
            </Text>
            {tab === t && (
              <View style={{ height: 2, backgroundColor: theme.text, marginTop: 6, borderRadius: 1 }} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Pager horizontal */}
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator color={theme.text} />
                </View>
              ) : (
                <FlatList
                  data={reels}
                  keyExtractor={(r) => r.id}
                  pagingEnabled
                  showsVerticalScrollIndicator={false}
                  snapToInterval={SCREEN_H - 200}
                  decelerationRate="fast"
                  ListEmptyComponent={
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 40, height: SCREEN_H - 240 }}>
                      <Text style={{ fontSize: 48, marginBottom: 16 }}>🎬</Text>
                      <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 20, textAlign: 'center', marginBottom: 8 }}>
                        Aún no hay reels
                      </Text>
                      <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center' }}>
                        Sé el primero en subir un video
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => (
                    <ReelItem item={item} theme={theme} fonts={fonts} height={SCREEN_H - 200} />
                  )}
                />
              )
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>📡</Text>
                <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 22, textAlign: 'center', marginBottom: 8 }}>
                  Streams en vivo
                </Text>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center' }}>
                  Próximamente: transmisiones en vivo
                </Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
