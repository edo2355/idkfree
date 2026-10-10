import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Avatar } from '../components/Avatar';

const MOODS = [
  { key: 'silencio', label: 'Silencio', emoji: '🤫' },
  { key: 'charlar', label: 'Charlar', emoji: '💬' },
  { key: 'crear', label: 'Crear', emoji: '🎨' },
  { key: 'tranquilo', label: 'Tranquilo', emoji: '🌊' },
  { key: 'nose', label: 'No sé', emoji: '🤷' },
] as const;

type Mood = typeof MOODS[number]['key'];

export function VibesScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [mood, setMood] = useState<Mood>('nose');
  const [message, setMessage] = useState('');
  const [vibes, setVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const res = await api.vibes.list({ limit: 50 });
      setVibes(res.vibes ?? []);
    } catch {}
    setLoading(false);
  }

  async function handleCreate() {
    if (!message.trim() || posting) return;
    setPosting(true);
    try {
      await api.vibes.create(mood, message.trim());
      setMessage('');
      await load();
    } catch (e: any) { console.log('vibe error', e); }
    setPosting(false);
  }

  async function toggleResonate(vibe: any) {
    const wasResonated = vibe.viewer_resonated;
    const newCount = wasResonated ? vibe.resonances_count - 1 : vibe.resonances_count + 1;
    setVibes((prev) =>
      prev.map((v) => v.id === vibe.id ? { ...v, viewer_resonated: !wasResonated, resonances_count: newCount } : v)
    );
    try {
      if (wasResonated) await api.vibes.unresonate(vibe.id);
      else await api.vibes.resonate(vibe.id);
    } catch {
      setVibes((prev) =>
        prev.map((v) => v.id === vibe.id ? { ...v, viewer_resonated: wasResonated, resonances_count: vibe.resonances_count } : v)
      );
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  useEffect(() => { load(); }, []);

  function moodMeta(key: string) {
    return MOODS.find((m) => m.key === key) ?? MOODS[4];
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={{ marginRight: 16 }}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
          Vibes
        </Text>
      </View>

      <FlatList
        data={vibes}
        keyExtractor={(v) => v.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.text} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* Composer */}
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {MOODS.map((m) => (
                  <TouchableOpacity
                    key={m.key}
                    onPress={() => setMood(m.key)}
                    activeOpacity={0.7}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: mood === m.key ? theme.text : theme.border,
                      backgroundColor: mood === m.key ? theme.text : 'transparent',
                    }}
                  >
                    <Text style={{ color: mood === m.key ? theme.bg : theme.text, fontFamily: fonts.medium, fontSize: 13 }}>
                      {m.emoji} {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="¿Cómo te sientes hoy?"
                placeholderTextColor={theme.textMuted}
                multiline
                maxLength={140}
                style={{
                  padding: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 10,
                  backgroundColor: theme.surface,
                  color: theme.text,
                  minHeight: 70,
                  textAlignVertical: 'top',
                  fontFamily: fonts.regular,
                  fontSize: 15,
                }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 11 }}>
                  {message.length}/140
                </Text>
                <TouchableOpacity
                  onPress={handleCreate}
                  disabled={!message.trim() || posting}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: message.trim() ? theme.text : theme.surface,
                    paddingHorizontal: 20,
                    paddingVertical: 9,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: message.trim() ? theme.bg : theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
                    {posting ? 'Publicando...' : 'Publicar vibe'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: theme.border, marginBottom: 8 }} />
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator color={theme.text} />
            </View>
          ) : (
            <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 60, fontFamily: fonts.regular }}>
              Aún no hay vibes activos
            </Text>
          )
        }
        renderItem={({ item }) => {
          const m = moodMeta(item.mood);
          return (
            <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { alias: item.author_alias })} activeOpacity={0.7}>
                  <Avatar name={item.author_name ?? item.author_alias} url={item.author_avatar} size={36} />
                </TouchableOpacity>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
                    {item.author_name ?? item.author_alias}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12 }}>
                    {getTimeAgo(new Date(item.created_at))}
                  </Text>
                </View>
                <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.border }}>
                  <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11 }}>
                    {m.emoji} {m.label}
                  </Text>
                </View>
              </View>

              {item.message ? (
                <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, marginBottom: 10 }}>
                  {item.message}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={() => toggleResonate(item)}
                activeOpacity={0.6}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}
              >
                <Text style={{ fontSize: 16 }}>✨</Text>
                <Text style={{ color: item.viewer_resonated ? theme.text : theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
                  Resonar {item.resonances_count > 0 ? `· ${item.resonances_count}` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
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
