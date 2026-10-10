import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Avatar } from '../components/Avatar';
import { HeaderBar } from '../components/HeaderBar';

export function ChatsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const res = await api.messages.conversations();
      setItems(res.conversations ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, [navigation]);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function timeAgo(str: string) {
    const d = new Date(str.replace(' ', 'T') + 'Z');
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'ahora';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    if (s < 604800) return `${Math.floor(s / 86400)}d`;
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar showBack title="Chats" />

      {loading ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c) => c.other_id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.text} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 60, fontFamily: fonts.regular }}>
              Sin conversaciones todavía
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Chat', { alias: item.other_alias })}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}
            >
              <Avatar name={item.other_name ?? item.other_alias} url={item.other_avatar} size={48} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>
                    {item.other_name ?? item.other_alias}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11 }}>
                    {timeAgo(item.last_at)}
                  </Text>
                </View>
                <Text numberOfLines={1} style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13 }}>
                  {item.last_message}
                </Text>
              </View>
              {item.unread_count > 0 ? (
                <View style={{ marginLeft: 8, minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: theme.accentAlt, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontFamily: fonts.medium, fontSize: 11 }}>{item.unread_count}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
