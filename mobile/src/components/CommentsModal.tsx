import { useEffect, useState } from 'react';
import { View, Text, Modal, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { Avatar } from './Avatar';
import { api } from '../api/client';
import type { Comment } from '../../shared/types';

interface Props {
  postId: string | null;
  visible: boolean;
  onClose: () => void;
  onCountChange?: (n: number) => void;
}

export function CommentsModal({ postId, visible, onClose, onCountChange }: Props) {
  const theme = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!visible || !postId) return;
    load();
  }, [visible, postId]);

  async function load() {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await api.comments.list(postId);
      setComments(res.comments ?? []);
      if (onCountChange) onCountChange((res.comments ?? []).length);
    } catch {}
    setLoading(false);
  }

  async function send() {
    if (!text.trim() || !postId || sending) return;
    setSending(true);
    try {
      await api.comments.create(postId, text.trim());
      setText('');
      await load();
    } catch {}
    setSending(false);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{ backgroundColor: theme.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', paddingBottom: 20 }}>
            {/* Handle */}
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.borderStrong }} />
            </View>

            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
                Comentarios
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
                <Text style={{ color: theme.textMuted, fontSize: 22, lineHeight: 22 }}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Lista */}
            {loading ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator color={theme.text} />
              </View>
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(c) => c.id}
                style={{ maxHeight: 400 }}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                  <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 30, fontFamily: fonts.regular }}>
                    Sé el primero en comentar
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <Avatar name={item.author_name ?? item.author_alias} url={item.author_avatar} size={36} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
                        {item.author_name ?? item.author_alias}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular, marginBottom: 4 }}>
                        @{item.author_alias} · {getTimeAgo(new Date(item.created_at))}
                      </Text>
                      <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                        {item.body}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}

            {/* Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Escribe un comentario..."
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
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function getTimeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return 'ahora';
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  if (s < 86400) return `${Math.floor(s / 3600)} h`;
  if (s < 604800) return `${Math.floor(s / 86400)} d`;
  return date.toLocaleDateString('es-ES');
}
