import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { Avatar } from './Avatar';

interface Props {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

export function DrawingsViewer({ postId, visible, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api.posts.drawings(postId);
        const withUrls = await Promise.all((res.drawings ?? []).map(async (d: any) => ({
          ...d,
          drawingUrl: await resolveAssetUrl(d.drawing_url),
        })));
        setDrawings(withUrls);
      } catch { setDrawings([]); }
      setLoading(false);
    })();
  }, [visible, postId]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', paddingTop: insets.top }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 }}>
          <Text style={{ color: '#FFF', fontFamily: fonts.displayBoldItalic, fontSize: 20, flex: 1 }}>
            Dibujos
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
            <Text style={{ color: '#FFF', fontSize: 26 }}>×</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#FFF" />
          </View>
        ) : drawings.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>✏️</Text>
            <Text style={{ color: '#AAA', fontFamily: fonts.regular }}>Sin dibujos aún</Text>
          </View>
        ) : (
          <FlatList
            data={drawings}
            keyExtractor={(d) => d.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 16, backgroundColor: '#111', borderRadius: 12, overflow: 'hidden' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
                  <Avatar name={item.author_name ?? item.author_alias} url={item.author_avatar} size={32} />
                  <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 13, marginLeft: 10 }}>
                    @{item.author_alias}
                  </Text>
                </View>
                {item.drawingUrl ? (
                  <Image source={{ uri: item.drawingUrl }} style={{ width: '100%', height: 300 }} resizeMode="contain" />
                ) : null}
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}
