import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Avatar } from '../components/Avatar';
import { HeaderBar } from '../components/HeaderBar';
import type { Notification } from '../../shared/types';

export function NotificationsScreen() {
  const theme = useTheme();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const res = await api.notifications.list({ limit: 50 });
      setItems(res.notifications ?? []);
    } catch {}
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function markAllRead() {
    try { await api.notifications.readAll(); } catch {}
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  }

  useEffect(() => { load(); }, []);

  function labelFor(n: Notification): string {
    switch (n.type) {
      case 'like': return 'le gustó tu post';
      case 'comment': return 'comentó tu post';
      case 'follow': return 'te siguió';
      case 'mention': return 'te mencionó';
      case 'repost': return 'reposteó tu post';
      default: return n.body ?? 'nueva actividad';
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar showBack title="Notificaciones" />
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        {items.some((n) => !n.read_at) ? (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.6}>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              Marcar leídas
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => n.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.text} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 60, fontFamily: fonts.regular }}>
              Sin notificaciones todavía
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                borderRadius: 10,
                marginBottom: 8,
                backgroundColor: item.read_at ? 'transparent' : theme.surface,
                borderWidth: 1,
                borderColor: item.read_at ? 'transparent' : theme.border,
              }}
            >
              <Avatar name={item.actor_name ?? item.actor_alias ?? '?'} url={item.actor_avatar} size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 19 }}>
                  <Text style={{ fontFamily: fonts.medium }}>{item.actor_name ?? item.actor_alias ?? 'Alguien'}</Text>
                  {' '}{labelFor(item)}
                </Text>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 }}>
                  {getTimeAgo(new Date(item.created_at))}
                </Text>
              </View>
              {!item.read_at ? (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.accentAlt }} />
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

function getTimeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return 'ahora';
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
  if (s < 604800) return `hace ${Math.floor(s / 86400)} d`;
  return date.toLocaleDateString('es-ES');
}
