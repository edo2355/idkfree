import { useEffect, useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { resolveAssetUrl } from '../utils/assetUrl';

export function VideoThumb({ uri, style }: { uri: string, style: any }) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function gen() {
      if (!uri) return;
      try {
        const realUrl = await resolveAssetUrl(uri);
        if (!realUrl) return;
        // Genera la miniatura en el segundo 1 del video
        const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(realUrl, {
          time: 1000,
          quality: 0.5,
        });
        if (mounted) setThumb(thumbUri);
      } catch (e) {
        console.log('No se pudo generar la miniatura', e);
      }
    }
    gen();
    return () => { mounted = false; };
  }, [uri]);

  return (
    <View style={[style, { backgroundColor: '#1A1A1A', overflow: 'hidden' }]}>
      {thumb ? (
        <Image source={{ uri: thumb }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#A3A3A3" />
        </View>
      )}
    </View>
  );
}
