// ============================================================
// CreateScreen.tsx — Cámara nativa + FOTO / VIDEO / NOTA
// Full native options: timer, grid, mirror, quality, res
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image, Modal, Switch, ScrollView,  } from 'react-native';
import { idkAlert as Alert } from '../components/IDKAlert';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { CustomGalleryModal } from '../components/CustomGalleryModal';

type Mode = 'camera' | 'preview' | 'note';
type ShotType = 'photo' | 'video';
type TimerOpt = 0 | 3 | 10;
type VidQuality = '480p' | '720p' | '1080p' | '2160p';

const NOTE_COLORS = ['#0F0F0F', '#1A1A2E', '#2E1A1A', '#1A2E1A', '#2E2E1A', '#1A1A1A'];

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

  // Native options
  const [timer, setTimer] = useState<TimerOpt>(0);
  const [timerCount, setTimerCount] = useState<number | null>(null);
  const [gridOn, setGridOn] = useState(false);
  const [mirrorOn, setMirrorOn] = useState(false);
  const [videoQuality, setVideoQuality] = useState<VidQuality>('1080p');
  const [autofocus, setAutofocus] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

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
    if (isRecording) interval = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    else setRecordingSeconds(0);
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!permission) return <View style={{ flex: 1, paddingBottom: 80, backgroundColor: '#000' }} />;
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#FFF', fontFamily: 'monospace', marginBottom: 100, textAlign: 'center' }}>
          // SECURITY_ACCESS_REQUIRED{'\n\n'}Se requiere acceso a la cámara.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={{ backgroundColor: '#32D3EE', paddingHorizontal: 20, paddingVertical: 12 }}>
          <Text style={{ color: '#000', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 1 }}>CONCEDER ACCESO ◆</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function uploadMedia(uri: string, isVideo: boolean) {
    setUploading(true);
    try {
      const res = await api.uploads.upload({
        uri,
        name: isVideo ? `video-${Date.now()}.mp4` : `photo-${Date.now()}.jpg`,
        type: isVideo ? 'video/mp4' : 'image/jpeg',
      });
      setUploadedUrl(res.url);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo subir');
      resetCamera();
    }
    setUploading(false);
  }

  async function takePhoto() {
    if (!cameraRef.current || timerCount !== null) return;

    // Timer countdown
    if (timer > 0) {
      for (let i = timer; i > 0; i--) {
        setTimerCount(i);
        await new Promise(r => setTimeout(r, 1000));
      }
      setTimerCount(null);
    }

    try {
      // CALIDAD MÁXIMA — sin compresión, sin procesamiento posterior
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
        exif: false,
      });
      setCapturedUri(photo.uri);
      setMode('preview');
      await uploadMedia(photo.uri, false);
    } catch (e: any) {
      setTimerCount(null);
      Alert.alert('Error', e?.message ?? 'No se pudo tomar la foto');
    }
  }

  async function startRecording() {
    if (!cameraRef.current || isRecording) return;
    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({ maxDuration: 60 });
      setIsRecording(false);
      setCapturedUri(video.uri);
      setMode('preview');
      await uploadMedia(video.uri, true);
    } catch (e: any) {
      setIsRecording(false);
      Alert.alert('Error', e?.message ?? 'No se pudo grabar');
    }
  }

  function stopRecording() {
    if (cameraRef.current && isRecording) cameraRef.current.stopRecording();
  }

  async function pickFromGallery(uri: string, isVideo: boolean) {
    setGalleryOpen(false);
    setShotType(isVideo ? 'video' : 'photo');
    setCapturedUri(uri);
    setMode('preview');
    await uploadMedia(uri, isVideo);
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

  // ---------- SETTINGS PANEL ----------
  const settingsPanel = (
    <Modal visible={settingsOpen} transparent animationType="slide" onRequestClose={() => setSettingsOpen(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#0A0A0A', borderTopWidth: 1, borderTopColor: '#222', padding: 20, paddingBottom: 40, maxHeight: '80%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 100 }}>
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 14, letterSpacing: 2 }}>[ OPCIONES ]</Text>
            <TouchableOpacity onPress={() => setSettingsOpen(false)}>
              <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 14 }}>[ ✗ ]</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Timer */}
            <Text style={{ color: '#888', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, marginBottom: 8 }}>TIMER</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 100 }}>
              {[0, 3, 10].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTimer(t as TimerOpt)}
                  style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: timer === t ? '#32D3EE' : '#333', backgroundColor: timer === t ? 'rgba(50,211,238,0.15)' : 'transparent' }}
                >
                  <Text style={{ color: timer === t ? '#32D3EE' : '#FFF', fontFamily: 'monospace', fontSize: 12 }}>
                    {t === 0 ? 'OFF' : `${t}s`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Video Quality */}
            <Text style={{ color: '#888', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, marginBottom: 8 }}>RESOLUCIÓN VIDEO</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 100 }}>
              {(['480p', '720p', '1080p', '2160p'] as VidQuality[]).map((q) => (
                <TouchableOpacity
                  key={q}
                  onPress={() => setVideoQuality(q)}
                  style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: videoQuality === q ? '#32D3EE' : '#333', backgroundColor: videoQuality === q ? 'rgba(50,211,238,0.15)' : 'transparent' }}
                >
                  <Text style={{ color: videoQuality === q ? '#32D3EE' : '#FFF', fontFamily: 'monospace', fontSize: 10 }}>
                    {q === '2160p' ? '4K' : q}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toggles */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#222' }}>
              <View>
                <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 12, letterSpacing: 1 }}>GRID 3×3</Text>
                <Text style={{ color: '#666', fontFamily: 'monospace', fontSize: 9, marginTop: 2 }}>Cuadrícula de composición</Text>
              </View>
              <Switch value={gridOn} onValueChange={setGridOn} trackColor={{ false: '#333', true: '#32D3EE' }} thumbColor="#FFF" />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#222' }}>
              <View>
                <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 12, letterSpacing: 1 }}>ESPEJO FRONTAL</Text>
                <Text style={{ color: '#666', fontFamily: 'monospace', fontSize: 9, marginTop: 2 }}>Cámara selfie como espejo</Text>
              </View>
              <Switch value={mirrorOn} onValueChange={setMirrorOn} trackColor={{ false: '#333', true: '#32D3EE' }} thumbColor="#FFF" />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#222' }}>
              <View>
                <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 12, letterSpacing: 1 }}>AUTOFOCUS</Text>
                <Text style={{ color: '#666', fontFamily: 'monospace', fontSize: 9, marginTop: 2 }}>Enfoque automático continuo</Text>
              </View>
              <Switch value={autofocus} onValueChange={setAutofocus} trackColor={{ false: '#333', true: '#32D3EE' }} thumbColor="#FFF" />
            </View>

            <View style={{ paddingVertical: 16, marginTop: 8, borderTopWidth: 1, borderTopColor: '#222' }}>
              <Text style={{ color: '#666', fontFamily: 'monospace', fontSize: 9, letterSpacing: 1 }}>
                FOTO: CALIDAD MÁXIMA (1.0) · SIN COMPRESIÓN
              </Text>
              <Text style={{ color: '#666', fontFamily: 'monospace', fontSize: 9, letterSpacing: 1, marginTop: 4 }}>
                VIDEO MÁX: 60s · {videoQuality}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // ---------- MODO NOTA ----------
  if (mode === 'note') {
    return (
      <View style={{ flex: 1, backgroundColor: noteBg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50 }}>
          <TouchableOpacity onPress={() => { setMode('camera'); setNoteText(''); }}>
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 14 }}>[ ✗ ]</Text>
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
            style={{ color: '#FFF', fontFamily: fonts.displayBoldItalic, fontSize: 26, textAlign: 'center', lineHeight: 34 }}
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
              style={{ width: 32, height: 32, borderRadius: 0, backgroundColor: c, borderWidth: c === noteBg ? 2 : 1, borderColor: c === noteBg ? '#FFF' : '#333' }}
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
        <TouchableOpacity onPress={resetCamera} style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>[ ✗ ]</Text>
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
        mirror={facing === 'front' ? mirrorOn : false}
        autofocus={autofocus ? 'on' : 'off'}
        videoQuality={videoQuality}
        mode={shotType === 'video' ? 'video' : 'picture'}
      />

      {/* Grid overlay */}
      {gridOn && (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <View style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <View style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <View style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <View style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </View>
      )}

      {/* Timer countdown */}
      {timerCount !== null && (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 140, fontFamily: fonts.displayBoldItalic, opacity: 0.9 }}>{timerCount}</Text>
        </View>
      )}

      {/* Top bar */}
      <View style={{ position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>[ ✗ ]</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {timer > 0 && (
            <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#32D3EE' }}>
              <Text style={{ color: '#32D3EE', fontFamily: 'monospace', fontSize: 11 }}>⏱ {timer}s</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setFlash(flash === 'off' ? 'on' : 'off')} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}>
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>{flash === 'off' ? '[FLASH] OFF' : '[FLASH] ON'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingsOpen(true)} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}>
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>[CFG]</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode selector */}
      <View style={{ position: 'absolute', top: 105, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
        {(['photo', 'video'] as ShotType[]).map((t) => (
          <TouchableOpacity key={t} onPress={() => setShotType(t)}>
            <Text style={{
              color: shotType === t ? '#FFF' : 'rgba(255,255,255,0.5)',
              fontFamily: 'monospace', fontSize: 12, letterSpacing: 2,
              borderBottomWidth: shotType === t ? 2 : 0, borderBottomColor: '#FFF', paddingBottom: 4,
            }}>{t === 'photo' ? 'FOTO' : 'VIDEO'}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setMode('note')}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: 12, letterSpacing: 2, paddingBottom: 4 }}>NOTA</Text>
        </TouchableOpacity>
        
        {/* NUEVO BOTÓN EN VIVO */}
        <TouchableOpacity onPress={() => navigation.navigate('StartStream')}>
          <Text style={{ color: '#EF4444', fontFamily: 'monospace', fontSize: 12, letterSpacing: 2, fontWeight: 'bold', paddingBottom: 4 }}>EN VIVO</Text>
        </TouchableOpacity>
      </View>

      {/* Recording indicator */}
      {isRecording && (
        <View style={{ position: 'absolute', top: 150, left: 0, right: 0, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 0 }}>
            <View style={{ width: 8, height: 8, borderRadius: 0, backgroundColor: '#FFF', marginRight: 8 }} />
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 12 }}>
              {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
      )}

      {/* Bottom controls */}
      <View style={{ position: 'absolute', bottom: 100, left: 0, right: 0, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 40 }}>
          <TouchableOpacity onPress={() => setGalleryOpen(true)} style={{ width: 48, height: 48, borderRadius: 0, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22 }}>[IMG]</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={() => shotType === 'video' && startRecording()}
            onPressOut={() => shotType === 'video' && stopRecording()}
            onPress={() => shotType === 'photo' && takePhoto()}
            style={{
              width: 80, height: 80, borderRadius: 0,
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

          <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')} style={{ width: 48, height: 48, borderRadius: 0, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22 }}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {settingsPanel}
      <CustomGalleryModal 
        visible={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        onSelect={pickFromGallery} 
      />
    </View>
  );
}
