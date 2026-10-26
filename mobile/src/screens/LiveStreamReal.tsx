import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  Animated, Dimensions, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { X, Gift, Heart, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const GIFTS = [
  { id: '1', name: 'Rosa', cost: 1, icon: '🌹' },
  { id: '2', name: 'Corazón', cost: 5, icon: '❤️' },
  { id: '3', name: 'Estrella', cost: 10, icon: '⭐' },
  { id: '4', name: 'León', cost: 50, icon: '🦁' },
  { id: '5', name: 'Fuego', cost: 100, icon: '🔥' },
];

export function LiveStreamReal({ route }: any) {
  const { roomName, isHost } = route.params || {};
  const navigation = useNavigation<any>();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [viewers, setViewers] = useState(1240);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const heartAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    setTimeout(() => setIsConnected(true), 1000);
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  const handleClose = () => {
    Keyboard.dismiss();
    setShowGifts(false);
    navigation.goBack();
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), user: 'Tú', text: inputText }]);
    setInputText('');
    Keyboard.dismiss();
  };

  const sendGift = (gift: any) => {
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

  if (!isConnected) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>CONECTANDO AL LIVE...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.videoBackground}>
          <Text style={{ color: '#333', fontFamily: 'monospace' }}>[ VIDEO DEL HOST ]</Text>
        </View>

        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.hostInfo}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.hostName}>@{roomName || 'host_idk'}</Text>
              <Text style={styles.viewerCount}>👁 {viewers} viendo</Text>
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
                  <TouchableOpacity onPress={() => setIsCameraOn(!isCameraOn)} style={styles.actionBtn}>
                    {isCameraOn ? <Video color="#fff" size={28} /> : <VideoOff color="#FF2D55" size={28} />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsMicOn(!isMicOn)} style={styles.actionBtn}>
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
  loadingText: { color: '#00E5FF', fontFamily: 'monospace', letterSpacing: 2 },
  videoBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
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
