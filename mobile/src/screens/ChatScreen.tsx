import { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../components/Avatar';
import { ScreenBackground } from '../components/ScreenBackground';

interface Msg {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export function ChatScreen() {
  const theme = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const me = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const alias: string = route.params?.alias;

  const [other, setOther] = useState<any>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function load() {
    try {
      const res = await api.messages.conversation(alias);
      setOther(res.other);
      setMessages(res.messages ?? []);
    } catch {}
    setLoading(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
  }

  useEffect(() => { load(); }, [alias]);

  async function send() {
    if (!text.trim() || sending) return;
    setSending(true);
    const body = text.trim();
    setText('');
    try {
      await api.messages.send(alias, body);
      await load();
    } catch {}
    setSending(false);
  }

  function timeAgo(str: string) {
    const d = new Date(str.replace(' ', 'T') + 'Z');
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'ahora';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }

  if (loading || !other) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
    
        <ScreenBackground variant="radio" />    <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      {/* Header */}
      <View style={{ paddingTop: 50, paddingHorizontal: 12, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={{ padding: 6 }}>
          <Text style={{ color: theme.text, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', { alias: other.alias })}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        >
          <Avatar name={other.name ?? other.alias} url={other.avatar_url} size={36} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>
              {other.name ?? other.alias}
            </Text>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12 }}>
              @{other.alias}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón ver perfil (opcional, redundante con el tap) */}
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', { alias: other.alias })}
          activeOpacity={0.6}
          style={{ padding: 8 }}
        >
          <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 12 }}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mensajes */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 40, fontFamily: fonts.regular }}>
            Sé el primero en escribir
          </Text>
        }
        renderItem={({ item }) => {
          const isMe = item.sender_id === me?.id;
          return (
            <View style={{ alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <View
                style={{
                  maxWidth: '78%',
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 16,
                  backgroundColor: isMe ? theme.text : theme.surface,
                  borderWidth: isMe ? 0 : 1,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ color: isMe ? theme.bg : theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                  {item.body}
                </Text>
              </View>
              <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 10, marginTop: 3, marginHorizontal: 4 }}>
                {timeAgo(item.created_at)}
              </Text>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: Math.max(12, insets.bottom), borderTopWidth: 1, borderTopColor: theme.border }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={theme.textSubtle}
          multiline
          style={{
            flex: 1,
            backgroundColor: theme.surface,
            color: theme.text,
            fontFamily: fonts.regular,
            fontSize: 14,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 20,
            maxHeight: 100,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        />
        <TouchableOpacity
          onPress={send}
          disabled={!text.trim() || sending}
          style={{
            marginLeft: 8,
            backgroundColor: text.trim() ? theme.text : theme.surface,
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 20,
          }}
          activeOpacity={0.7}
        >
          {sending ? (
            <ActivityIndicator color={theme.bg} size="small" />
          ) : (
            <Text style={{ color: text.trim() ? theme.bg : theme.textSubtle, fontFamily: fonts.medium, fontSize: 13 }}>
              Enviar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
