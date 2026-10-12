import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Avatar } from '../components/Avatar';

type Tab = 'recientes' | 'todos' | 'legado';

const MOODS: Record<string, string> = {
  silencio: '🤫',
  charlar: '💬',
  crear: '🎨',
  tranquilo: '🌊',
  nose: '🤷',
};

export function VibesScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('recientes');
  const [vibes, setVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      let res;
      if (tab === 'legado') {
        res = await api.vibes.legacy({ limit: 50 });
      } else if (tab === 'todos') {
        res = await api.vibes.all({ limit: 50 });
      } else {
        res = await api.vibes.list({ limit: 50 });
      }
      setVibes(res.vibes ?? []);
    } catch { setVibes([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={{ padding: 4 }}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontSize: 22, fontFamily: fonts.displayBoldItalic, marginLeft: 8, flex: 1 }}>
          Vibes
        </Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 }}>
        {(['recientes', 'todos', 'legado'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            activeOpacity={0.7}
            style={{
              flex: 1, paddingVertical: 8, borderRadius: 20,
              backgroundColor: tab === t ? theme.text : theme.surface,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: tab === t ? theme.bg : theme.textMuted,
              fontFamily: fonts.medium, fontSize: 12, letterSpacing: 0.5,
            }}>
              {t === 'recientes' ? 'RECIENTES' : t === 'todos' ? 'TODOS' : 'LEGADO'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : (
        <FlatList
          data={vibes}
          keyExtractor={(v) => v.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
          ListEmptyComponent={
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>
                {tab === 'legado' ? '🕯️' : '💭'}
              </Text>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, textAlign: 'center' }}>
                {tab === 'legado'
                  ? 'Aún no hay vibes en modo legado'
                  : tab === 'todos'
                  ? 'Aún no hay vibes públicas'
                  : 'Sin vibes recientes'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
              borderRadius: 14, padding: 14, marginBottom: 10,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Avatar name={item.author_name ?? item.author_alias} url={item.author_avatar} size={36} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
                    {item.author_name ?? item.author_alias}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11 }}>
                    @{item.author_alias}
                  </Text>
                </View>
                <Text style={{ fontSize: 28 }}>{MOODS[item.mood] ?? '💭'}</Text>
              </View>
              {item.message ? (
                <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 }}>
                  {item.message}
                </Text>
              ) : null}
              {item.resonances_count > 0 ? (
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 8 }}>
                  💜 {item.resonances_count} resonancias
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}
