import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../stores/themeStore';
import { api } from '../api/client';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/Avatar';
import { GlassPanel } from '../components/GlassPanel';

export function ChatsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.messages.conversations();
        setChats(res.conversations ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontFamily: fonts.displayBoldItalic }}>Mensajes</Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10, marginTop: 4, letterSpacing: 2 }}>CANAL_ENCRIPTADO</Text>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Chat', { alias: item.alias })}
            style={{ marginBottom: 10 }}
          >
            <GlassPanel style={{ padding: 15, flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Avatar name={item.name ?? item.alias} url={item.avatar_url} size={50} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontFamily: fonts.medium, fontSize: 16 }}>{item.name ?? item.alias}</Text>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
                  {item.last_message || 'Toca para chatear'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10 }}>
                  {item.last_message_at ? new Date(item.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </Text>
                {item.unread_count > 0 && (
                  <View style={{ backgroundColor: theme.accent, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                    <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>{item.unread_count}</Text>
                  </View>
                )}
              </View>
            </GlassPanel>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
