import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (uri: string, isVideo: boolean) => void;
}

export function CustomGalleryModal({ visible, onClose, onSelect }: Props) {
  const theme = useTheme();
  const [tab, setTab] = useState<'local' | 'cloud'>('local');
  const [localMedia, setLocalMedia] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && tab === 'local') {
      loadLocalMedia();
    }
  }, [visible, tab]);

  async function loadLocalMedia() {
    setLoading(true);
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const res = await MediaLibrary.getAssetsAsync({
        mediaType: ['photo', 'video'],
        sortBy: ['creationTime'],
        first: 50,
      });
      setLocalMedia(res.assets);
    }
    setLoading(false);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50 }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: theme.textMuted, fontFamily: 'monospace' }}>[ CERRAR ]</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.text, fontFamily: 'monospace', fontSize: 14 }}>GALERÍA</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 20 }}>
          <TouchableOpacity onPress={() => setTab('local')}>
            <Text style={{ color: tab === 'local' ? theme.accent : theme.textMuted, fontFamily: fonts.medium, fontSize: 14 }}>RECIENTES</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('cloud')}>
            <Text style={{ color: tab === 'cloud' ? theme.accent : theme.textMuted, fontFamily: fonts.medium, fontSize: 14 }}>NUBE</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <ActivityIndicator color={theme.text} style={{ marginTop: 50 }} />
        ) : tab === 'local' ? (
          <FlatList
            data={localMedia}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item.uri, item.mediaType === 'video')}
                style={{ width: '33.33%', aspectRatio: 1, padding: 1 }}
              >
                <Image source={{ uri: item.uri }} style={{ flex: 1, backgroundColor: theme.surface }} />
                {item.mediaType === 'video' && (
                  <View style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.7)', padding: 4, borderRadius: 4 }}>
                    <Text style={{ color: '#FFF', fontSize: 10 }}>VIDEO</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular }}>
              Tus borradores en la nube aparecerán aquí.
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
