import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { idkAlert as Alert } from './IDKAlert';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api/client';
import { Avatar } from './Avatar';

const MOODS = [
  { key: 'silencio', emoji: '[MUTE]' },
  { key: 'charlar', emoji: '[CHAT]' },
  { key: 'crear', emoji: '[ART]' },
  { key: 'tranquilo', emoji: '[WAVE]' },
  { key: 'nose', emoji: '[?]' },
];

export function NotesRow() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const me = useAuthStore((s) => s.user);
  const [vibes, setVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [mood, setMood] = useState('nose');
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  async function load() {
    try {
      const res = await api.vibes.list({ limit: 30 });
      setVibes(res.vibes ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (!message.trim() || posting) return;
    setPosting(true);
    try {
      await api.vibes.create(mood, message.trim());
      setMessage('');
      setMood('nose');
      setComposerOpen(false);
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo publicar');
    }
    setPosting(false);
  }

  const myVibe = vibes.find((v) => v.author_id === me?.id);

  if (loading) {
    return (
      <View style={{ paddingVertical: 10, alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <>
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Vibes')}
          activeOpacity={0.6}
          style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13, letterSpacing: 0.5 }}>
            VIBES
          </Text>
          <Text style={{ color: theme.textMuted, marginLeft: 6, fontSize: 11 }}>ver todas →</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 12 }}
        >
          {/* Botón de Crear */}
          <TouchableOpacity
            onPress={() => setComposerOpen(true)}
            activeOpacity={0.7}
            style={{ alignItems: 'center', width: 64 }}
          >
            <View style={{ width: 56, height: 56, borderRadius: 28, padding: 2, borderWidth: 1, borderColor: theme.accent, borderStyle: 'dashed' }}>
              <View style={{ flex: 1, borderRadius: 25, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceElevated }}>
                <Text style={{ fontSize: 24, color: theme.accent, marginTop: -2 }}>+</Text>
              </View>
            </View>
            <Text style={{ color: theme.accent, fontFamily: fonts.medium, fontSize: 10, marginTop: 4 }}>
              Añadir
            </Text>
          </TouchableOpacity>

          {/* Notas de otros */}
          {vibes.filter((v) => v.author_id !== me?.id).slice(0, 15).map((v) => (
            <TouchableOpacity
              key={v.id}
              activeOpacity={0.7}
              style={{ alignItems: 'center', width: 72, marginRight: 8 }}
            >
              {/* El Globo (Bocadillo) */}
              <View style={{
                backgroundColor: theme.surfaceElevated,
                borderRadius: 16,
                borderBottomLeftRadius: 4, // Hace la forma de globo
                borderWidth: 1,
                borderColor: theme.border,
                paddingHorizontal: 10,
                paddingVertical: 8,
                minHeight: 56,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 16, marginBottom: 2 }}>
                  {MOODS.find((m) => m.key === v.mood)?.emoji ?? '[•]'}
                </Text>
                {v.message ? (
                  <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 10, textAlign: 'center' }} numberOfLines={2}>
                    {v.message}
                  </Text>
                ) : null}
              </View>
              
              {/* La colita del globo */}
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 12, marginTop: -1 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.border }} />
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.border, marginLeft: -2, marginTop: 4 }} />
              </View>

              {/* Nombre de usuario */}
              <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 10, marginTop: 4 }} numberOfLines={1}>
                @{v.author_alias}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Composer modal */}
      <Modal visible={composerOpen} transparent animationType="slide" onRequestClose={() => setComposerOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.bg, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 20, marginBottom: 12 }}>
              Tu nota
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  onPress={() => setMood(m.key)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                    backgroundColor: mood === m.key ? theme.text : theme.surface,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="¿Qué estás pensando?"
              placeholderTextColor={theme.textSubtle}
              maxLength={60}
              multiline
              style={{
                backgroundColor: theme.surface, color: theme.text,
                fontFamily: fonts.regular, fontSize: 15, padding: 12, borderRadius: 10,
                minHeight: 60, textAlignVertical: 'top',
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <TouchableOpacity
                onPress={() => setComposerOpen(false)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: theme.surface }}
              >
                <Text style={{ color: theme.text, fontFamily: fonts.medium }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={create}
                disabled={posting || !message.trim()}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: message.trim() ? theme.text : theme.surface }}
              >
                {posting ? <ActivityIndicator color={theme.bg} /> : (
                  <Text style={{ color: message.trim() ? theme.bg : theme.textMuted, fontFamily: fonts.medium }}>
                    Publicar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
