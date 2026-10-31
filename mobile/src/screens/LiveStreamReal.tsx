import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator,
  Animated, Dimensions, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { X, Gift, Heart, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react-native';
import { api } from '../api/client';
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/react-native';
import { Track, RoomOptions, VideoPresets, RoomEvent, DataPacket_Kind } from 'livekit-client';

const { width, height } = Dimensions.get('window');

const GIFTS = [
  { id: '1', name: 'Rosa', cost: 1, icon: '🌹' },
  { id: '2', name: 'Corazón', cost: 5, icon: '❤️' },
  { id: '3', name: 'Estrella', cost: 10, icon: '⭐' },
  { id: '4', name: 'León', cost: 50, icon: '🦁' },
  { id: '5', name: 'Fuego', cost: 100, icon: '🔥' },
];

const roomOptions: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  videoCaptureDefaults: {
    resolution: VideoPresets.h360.resolution,
  },
  publishDefaults: {
    videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
    videoCodec: 'vp8',
    videoEncoding: {
      maxBitrate: 300_000,
      maxFramerate: 20,
    },
  },
  reconnectPolicy: {
    nextRetryDelayInMs: (ctx) => {
      if (ctx.retryCount >= 5) return null;
      return Math.min(1000 * Math.pow(2, ctx.retryCount), 10000);
    },
  },
};

export function LiveStreamReal({ route }: any) {
  const { roomName, isHost } = route.params || {};
  const navigation = useNavigation<any>();

  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string>('wss://idkfree-j8j98whs.livekit.cloud');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.livekit.getToken(roomName, isHost);
        setToken(res.token);
        if (res.url) setServerUrl(res.url);
      } catch (err: any) {
        setError(err.message || 'Error obteniendo token');
      }
    })();
  }, [roomName, isHost]);

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#EF4444', fontFamily: 'monospace', marginBottom: 20 }}>❌ {error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#00E5FF', fontFamily: 'monospace' }}>[ VOLVER ]</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#00E5FF" size="large" />
        <Text style={styles.loadingText}>CONECTANDO AL LIVE...</Text>
      </View>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect={true}
      video={true}
      audio={true}
      options={{
        dynacast: true,
        adaptiveStream: true,
        publishDefaults: {
          simulcast: true,
          videoCodec: 'h264', // H.264 usa hardware (ahorra batería)
          videoSimulcastLayers: [
            { width: 320, height: 240, bitrate: 150000 },
            { width: 640, height: 480, bitrate: 500000 },
          ],
          videoEncoding: {
            maxBitrate: 800000, // Máx 800 kbps (evita consumo de datos masivo)
            maxFramerate: 24,   // 24 fps es más que suficiente
          },
        },
        videoCaptureDefaults: {
          resolution: { width: 640, height: 480 }, // Evita grabar en 4K
        },
        // Fuerza TURN en redes restrictivas (Cuba)
        rtcConfig: {
          iceTransportPolicy: 'relay',
        },
      }}
    > navigation.goBack()}
    >
      <RoomView roomName={roomName} isHost={isHost} />
    </LiveKitRoom>
  );
}

function RoomView({ roomName, isHost }: { roomName: string, isHost: boolean }) {
  const navigation = useNavigation<any>();
  const room = useRoomContext();
  const tracks = useTracks([Track.Source.Camera]);
  const { localParticipant } = useLocalParticipant();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(isHost);
  const [isMicOn, setIsMicOn] = useState(isHost);

  const heartAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const onData = (payload: Uint8Array, participant: any, kind: any, topic: string) => {
      const text = new TextDecoder().decode(payload);
      try {
        const data = JSON.parse(text);
        setMessages((prev) => [...prev, { id: Date.now().toString(), user: data.user, text: data.text, isGift: data.isGift }]);
      } catch (e) {}
    };
    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
      Keyboard.dismiss();
    };
  }, [room]);

  const handleClose = async () => {
    Keyboard.dismiss();
    setShowGifts(false);
    await room.disconnect();
    navigation.goBack();
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const payload = { user: 'Tú', text: inputText };
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    await localParticipant.publishData(encoded, DataPacket_Kind.RELIABLE);
    setMessages((prev) => [...prev, { id: Date.now().toString(), user: 'Tú', text: inputText }]);
    setInputText('');
    Keyboard.dismiss();
  };

  const sendGift = async (gift: any) => {
    const payload = { user: 'Sistema', text: `¡Has enviado un ${gift.name}! ${gift.icon}`, isGift: true };
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    await localParticipant.publishData(encoded, DataPacket_Kind.RELIABLE);
    setMessages((prev) => [...prev, { id: Date.now().toString(), user: 'Sistema', text: `¡Has enviado un ${gift.name}! ${gift.icon}`, isGift: true }]);
    setShowGifts(false);
    triggerHeartAnimation();
  };

  const triggerHeartAnimation = () => {
    heartAnims.forEach((anim, index) => {
      anim.setValue(0);
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ]).start();
    });
  };

  const hostTrack = tracks.find((t) => !t.participant.isLocal);
  const localTrack = tracks.find((t) => t.participant.isLocal);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.videoBackground}>
          {hostTrack ? (
            <VideoTrack trackRef={hostTrack} style={StyleSheet.absoluteFill} />
          ) : (
            <Text style={{ color: '#555', fontFamily: 'monospace' }}>[ ESPERANDO AL HOST... ]</Text>
          )}

          {isHost && localTrack && (
            <View style={styles.pipContainer}>
              <VideoTrack trackRef={localTrack} style={styles.pipVideo} />
            </View>
          )}
        </View>

        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.hostInfo}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.hostName}>@{roomName || 'host_idk'}</Text>
              <Text style={styles.viewerCount}>👁 EN VIVO</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X color="#fff" size={24} />
          </TouchableOpacity>
        </SafeAreaView>

        <View pointerEvents="none" style={styles.heartsContainer}>
          {heartAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                bottom: 100 + Math.random() * 200,
                right: 20 + Math.random() * 50,
                opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                transform: [
                  { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -300] }) },
                  { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.5, 1] }) },
                ],
              }}
            >
              <Heart color="#FF2D55" fill="#FF2D55" size={32} />
            </Animated.View>
          ))}
        </View>

        <View style={styles.chatContainer}>
          <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 10 }}>
            {messages.map((msg) => (
              <View key={msg.id} style={styles.messageBubble}>
                <Text style={styles.messageUser}>{msg.user}: </Text>
                <Text style={[styles.messageText, msg.isGift && { color: '#FFD700', fontWeight: 'bold' }]}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={20}>
          <View style={styles.bottomBar}>
            <View style={styles.inputContainer}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Di algo..."
                placeholderTextColor="#888"
                style={styles.input}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowGifts(!showGifts); }} style={styles.actionBtn}>
                <Gift color="#FFD700" size={28} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Keyboard.dismiss(); triggerHeartAnimation(); }} style={styles.actionBtn}>
                <Heart color="#FF2D55" fill="#FF2D55" size={28} />
              </TouchableOpacity>
              {isHost && (
                <>
                  <TouchableOpacity onPress={async () => { await localParticipant.setCameraEnabled(!isCameraOn); setIsCameraOn(!isCameraOn); }} style={styles.actionBtn}>
                    {isCameraOn ? <Video color="#fff" size={28} /> : <VideoOff color="#FF2D55" size={28} />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async () => { await localParticipant.setMicrophoneEnabled(!isMicOn); setIsMicOn(!isMicOn); }} style={styles.actionBtn}>
                    {isMicOn ? <Mic color="#fff" size={28} /> : <MicOff color="#FF2D55" size={28} />}
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity onPress={handleClose} style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}>
                <PhoneOff color="#fff" size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {showGifts && (
          <View style={styles.giftModal}>
            <View style={styles.giftHeader}>
              <Text style={styles.giftTitle}>Enviar Regalo</Text>
              <TouchableOpacity onPress={() => setShowGifts(false)}>
                <X color="#fff" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.giftGrid}>
              {GIFTS.map((g) => (
                <TouchableOpacity key={g.id} style={styles.giftItem} onPress={() => sendGift(g)}>
                  <Text style={{ fontSize: 32 }}>{g.icon}</Text>
                  <Text style={styles.giftName}>{g.name}</Text>
                  <Text style={styles.giftCost}>{g.cost} pts</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#00E5FF', fontFamily: 'monospace', letterSpacing: 2, marginTop: 20 },
  videoBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  pipContainer: { position: 'absolute', top: 100, right: 20, width: 100, height: 140, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: '#00E5FF', zIndex: 5 },
  pipVideo: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 16, zIndex: 20 },
  hostInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 30, paddingRight: 16 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#00E5FF' },
  hostName: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  viewerCount: { color: '#ccc', fontSize: 12 },
  closeBtn: { backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 25 },
  heartsContainer: { ...StyleSheet.absoluteFillObject, zIndex: 5 },
  chatContainer: { position: 'absolute', bottom: 100, left: 10, width: '70%', maxHeight: 250, zIndex: 10 },
  chatScroll: { flexGrow: 0 },
  messageBubble: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 6, alignSelf: 'flex-start' },
  messageUser: { color: '#00E5FF', fontWeight: 'bold', fontSize: 12 },
  messageText: { color: '#fff', fontSize: 12 },
  bottomBar: { position: 'absolute', bottom: 20, left: 10, right: 10, flexDirection: 'row', alignItems: 'center', zIndex: 20 },
  inputContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingHorizontal: 15, marginRight: 10, height: 44, justifyContent: 'center' },
  input: { color: '#fff', fontSize: 14 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
  giftModal: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#181b21', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, zIndex: 30 },
  giftHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  giftTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  giftGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center' },
  giftItem: { alignItems: 'center', width: 70 },
  giftName: { color: '#fff', fontSize: 12, marginTop: 5 },
  giftCost: { color: '#FFD700', fontSize: 10, marginTop: 2 },
});
