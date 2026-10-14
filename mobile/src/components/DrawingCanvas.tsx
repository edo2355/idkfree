import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Dimensions, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';

interface Props {
  postId: string;
  imageUrl: string;
  onClose: () => void;
  onSaved: () => void;
}

const COLORS = ['#FFFFFF', '#FF3B30', '#FFCC00', '#34C759', '#007AFF', '#AF52DE'];

export function DrawingCanvas({ postId, imageUrl, onClose, onSaved }: Props) {
  const theme = useTheme();
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [uploading, setUploading] = useState(false);
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);
  const captureViewRef = useRef<View>(null);

  const screen = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      const u = await resolveAssetUrl(imageUrl);
      setResolvedImage(u);
    })();
  }, [imageUrl]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(`M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => `${prev} L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`);
      },
      onPanResponderRelease: () => {
        setCurrentPath((prev) => {
          if (prev) setPaths((p) => [...p, prev]);
          return '';
        });
      },
    })
  ).current;

  function undo() {
    setPaths((p) => p.slice(0, -1));
  }

  function clear() {
    setPaths([]);
    setCurrentPath('');
  }

  async function save() {
    if (paths.length === 0) {
      Alert.alert('Vacío', 'Dibuja algo primero');
      return;
    }
    setUploading(true);
    try {
      const uri = await captureRef(captureViewRef, { format: 'png', quality: 0.8 });
      const up = await api.uploads.upload({
        uri,
        name: `drawing-${Date.now()}.png`,
        type: 'image/png',
      });
      await api.posts.draw(postId, up.url);
      Alert.alert('¡Guardado!', 'Tu dibujo quedó sobre este post');
      onSaved();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar');
    }
    setUploading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Barra superior */}
      <View style={{ paddingTop: 40, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>Cancelar</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={undo} activeOpacity={0.6} style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 20 }}>↶</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clear} activeOpacity={0.6} style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas capturable */}
      <View
        ref={captureViewRef}
        collapsable={false}
        style={{ flex: 1, backgroundColor: '#000' }}
        {...panResponder.panHandlers}
      >
        {resolvedImage ? (
          <ImageBackground
            source={{ uri: resolvedImage }}
            style={{ flex: 1 }}
            resizeMode="contain"
          >
            <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
              {paths.map((p, i) => (
                <Path key={i} d={p} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {currentPath ? (
                <Path d={currentPath} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ) : null}
            </Svg>
          </ImageBackground>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#FFF" />
          </View>
        )}
      </View>

      {/* Barra inferior colores */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 30, paddingTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: c,
              borderWidth: color === c ? 3 : 1,
              borderColor: color === c ? '#FFF' : '#555',
            }}
          />
        ))}
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={save}
          disabled={uploading}
          style={{ backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
        >
          {uploading ? <ActivityIndicator color="#000" /> : (
            <Text style={{ color: '#000', fontFamily: fonts.medium, fontSize: 14 }}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
