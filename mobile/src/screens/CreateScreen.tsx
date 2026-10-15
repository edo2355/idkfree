// ============================================================
// CreateScreen.tsx — Cámara nativa + FOTO / VIDEO / NOTA
// Modo NOTA → publica como vibe (48h)
// ============================================================
import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ActivityIndicator,
  Image, Alert, useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';

type Mode = 'camera' | 'preview' | 'note';
type ShotType = 'photo' | 'video';

const NOTE_COLORS = [
  '#0F0F0F',
  '#1A1A2E',
  '#2E1A1A',
  '#1A2E1A',
  '#2E2E1A',
];

export function CreateScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [shotType, setShotType] = useState<ShotType>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const [mode, setMode] = useState<Mode>('camera');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);

  const [noteText, setNoteText] = useState('');
  const [noteBg, setNoteBg] = useState(NOTE_COLORS[0]);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#FFF', fontFamily: 'monospace', marginBottom: 20, textAlign: 'center' }}>
          // SECURITY_ACCESS_REQUIRED{'\n\n'}
          Se requiere acceso a la cámara para crear contenido.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ backgroundColor: '#32D3EE', paddingHorizontal: 20, paddingVertical: 12 }}
        >
          <Text style={{ color: '#000', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 1 }}>
            CONCEDER ACCESO ✦
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePhoto() {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      setCapturedUri(photo.uri);
      setMode('preview');
      setUploading(true);
      try {
        const res = await api.uploads.upload({
          uri: photo.uri,
          name: `photo-${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
        setUploadedUrl(res.url);
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'No se pudo subir la foto');
      }
      setUploading(false);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo tomar la foto');
    }
  }

  async function startRecording() {
    if (!cameraRef.current || isRecording) return;
    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      setIsRecording(false);
      setCapturedUri(video.uri);
      setMode('preview');
      setUploading(true);
      try {
        const res = await api.uploads.upload({
          uri: video.uri,
          name: `video-${Date.now()}.mp4`,
          type: 'video/mp4',
        });
        setUploadedUrl(res.url);
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'No se pudo subir el video');
      }
      setUploading(false);
    } catch (e: any) {
      setIsRecording(false);
      Alert.alert('Error', e?.message ?? 'No se pudo grabar');
    }
  }

  function stopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  }

  async function pickFromGallery() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: shotType === 'photo' ? ImagePicker.MediaTypeOptions.Images : ['videos'],
      quality: 0.85,
      allowsEditing: shotType === 'photo',
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setCapturedUri(asset.uri);
    setMode('preview');
    setUploading(true);
    try {
      const res = await api.uploads.upload({
        uri: asset.uri,
        name: asset.fileName ?? `media-${Date.now()}`,
        type: asset.mimeType ?? (shotType === 'photo' ? 'image/jpeg' : 'video/mp4'),
      });
      setUploadedUrl(res.url);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo subir');
    }
    setUploading(false);
  }

  async function publishPost() {
    if (!uploadedUrl) return;
    setPosting(true);
    try {
      await api.posts.create({
        body: caption.trim() || null,
        imageUrl: shotType === 'photo' ? uploadedUrl : null,
        videoUrl: shotType === 'video' ? uploadedUrl : null,
        visibility: 'followers',
      });
      navigation.navigate('Feed');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo publicar');
    }
    setPosting(false);
  }

  async function publishNote() {
    if (!noteText.trim()) return;
    setPosting(true);
    try {
      await api.vibes.create('nose', noteText.trim());
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo publicar la nota');
    }
    setPosting(false);
  }

  function resetCamera() {
    setCapturedUri(null);
    setUploadedUrl(null);
    setCaption('');
    setMode('camera');
  }

  // ---------- MODO NOTA ----------
  if (mode === 'note') {
    return (
      <View style={{ flex: 1, backgroundColor: noteBg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50 }}>
          <TouchableOpacity onPress={() => { setMode('camera'); setNoteText(''); }}>
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 14 }}>[ ✕ ]</Text>
          </TouchableOpacity>
          <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2 }}>NUEVA NOTA · 48H</Text>
          <TouchableOpacity onPress={publishNote} disabled={!noteText.trim() || posting}>
            <Text style={{ color: noteText.trim() ? '#FFF' : '#666', fontFamily: 'monospace', fontSize: 12 }}>
              {posting ? '...' : '[ PUBLICAR ]'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="¿Qué quieres decir?"
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            autoFocus
            maxLength={140}
            style={{
              color: '#FFF',
              fontFamily: fonts.displayBoldItalic,
              fontSize: 26,
              textAlign: 'center',
              lineHeight: 34,
            }}
          />
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 10, textAlign: 'center', marginTop: 16, letterSpacing: 1 }}>
            {noteText.length} / 140
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, paddingBottom: 40 }}>
          {NOTE_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setNoteBg(c)}
              style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: c,
                borderWidth: c === noteBg ? 2 : 1,
                borderColor: c === noteBg ? '#FFF' : '#333',
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  // ---------- MODO PREVIEW ----------
  if (mode === 'preview' && capturedUri) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Image source={{ uri: capturedUri }} style={{ flex: 1 }} resizeMode="contain" />

        <TouchableOpacity
          onPress={resetCamera}
          style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}
        >
          <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>[ ✕ ]</Text>
        </TouchableOpacity>

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.85)', padding: 20, paddingBottom: 40 }}>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Añade un comentario..."
            placeholderTextColor="#666"
            style={{ color: '#FFF', fontFamily: fonts.regular, fontSize: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333', marginBottom: 16 }}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={resetCamera} style={{ flex: 1, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#333' }}>
              <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 12 }}>REPETIR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={publishPost}
              disabled={!uploadedUrl || posting || uploading}
              style={{ flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: uploadedUrl && !posting && !uploading ? '#FFF' : '#333' }}
            >
              {posting || uploading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={{ color: uploadedUrl ? '#000' : '#666', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>
                  PUBLICAR
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ---------- MODO CÁMARA ----------
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={flash}
        mode={shotType === 'video' ? 'video' : 'picture'}
      />

      <View style={{ position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>[ ✕ ]</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}
        >
          <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>
            {flash === 'off' ? '⚡ OFF' : '⚡ ON'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', top: 105, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
        <TouchableOpacity onPress={() => setShotType('photo')}>
          <Text style={{
            color: shotType === 'photo' ? '#FFF' : 'rgba(255,255,255,0.5)',
            fontFamily: 'monospace', fontSize: 12, letterSpacing: 2,
            borderBottomWidth: shotType === 'photo' ? 2 : 0,
            borderBottomColor: '#FFF', paddingBottom: 4,
          }}>
            FOTO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShotType('video')}>
          <Text style={{
            color: shotType === 'video' ? '#FFF' : 'rgba(255,255,255,0.5)',
            fontFamily: 'monospace', fontSize: 12, letterSpacing: 2,
            borderBottomWidth: shotType === 'video' ? 2 : 0,
            borderBottomColor: '#FFF', paddingBottom: 4,
          }}>
            VIDEO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('note')}>
          <Text style={{
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'monospace', fontSize: 12, letterSpacing: 2,
            paddingBottom: 4,
          }}>
            NOTA
          </Text>
        </TouchableOpacity>
      </View>

      {isRecording && (
        <View style={{ position: 'absolute', top: 150, left: 0, right: 0, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF', marginRight: 8 }} />
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 12 }}>
              {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
      )}

      <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 40 }}>
          <TouchableOpacity onPress={pickFromGallery} style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22 }}>🖼️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={() => shotType === 'video' && startRecording()}
            onPressOut={() => shotType === 'video' && stopRecording()}
            onPress={() => shotType === 'photo' && takePhoto()}
            style={{
              width: 80, height: 80, borderRadius: 40,
              borderWidth: 4, borderColor: '#FFF',
              backgroundColor: shotType === 'video' && isRecording ? '#EF4444' : 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <View style={{
              width: shotType === 'video' && isRecording ? 30 : 60,
              height: shotType === 'video' && isRecording ? 30 : 60,
              borderRadius: shotType === 'video' && isRecording ? 6 : 30,
              backgroundColor: '#FFF',
            }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22 }}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
