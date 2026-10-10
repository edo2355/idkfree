import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { Avatar } from './Avatar';
import { HeartIcon } from './icons/HeartIcon';
import { CommentIcon } from './icons/CommentIcon';
import { ShareIcon } from './icons/ShareIcon';
import { MoreIcon } from './icons/MoreIcon';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import type { Post } from '../../shared/types';
import { resolveAssetUrl } from '../utils/assetUrl';

interface Props {
  post: Post;
  onPress?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

export function PostCard({ post, onPress, onComment, onShare, onDelete }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const me = useAuthStore((s) => s.user);
  const [liked, setLiked] = useState(post.liked_by_me ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [busy, setBusy] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    resolveAssetUrl(post.image_url).then((u) => { console.log("IMG URL:", u); setImageUrl(u); });
  }, [post.image_url]);

  const isMine = me?.id === post.author_id;

  async function toggleLike() {
    if (busy) return;
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLiked(nextLiked);
    setLikesCount(nextCount);
    setBusy(true);
    try {
      if (nextLiked) await api.posts.like(post.id);
      else await api.posts.unlike(post.id);
    } catch {
      setLiked(!nextLiked);
      setLikesCount(likesCount);
    }
    setBusy(false);
  }

  async function doDelete() {
    try {
      await api.posts.delete(post.id);
      setDeleted(true);
      if (onDelete) onDelete();
    } catch {}
  }

  function openMenu() {
    const options = ['Cancelar', 'Eliminar'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, destructiveButtonIndex: 1, cancelButtonIndex: 0 },
        (i) => { if (i === 1) doDelete(); }
      );
    } else {
      Alert.alert('Opciones', undefined, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: doDelete },
      ]);
    }
  }

  function renderBody(text: string) {
    const parts = text.split(/(#[\wáéíóúñÁÉÍÓÚÑ]+|@[\w.]+)/g);
    return (
      <Text style={{ color: theme.text, lineHeight: 22, marginBottom: 12, fontFamily: fonts.regular, fontSize: 15 }}>
        {parts.map((part, i) => {
          if (part.startsWith('#')) {
            return (
              <Text
                key={i}
                style={{ color: theme.text, fontFamily: fonts.medium }}
                onPress={() => navigation.navigate('Hashtag', { tag: part.slice(1).toLowerCase() })}
              >
                {part}
              </Text>
            );
          }
          if (part.startsWith('@')) {
            return (
              <Text
                key={i}
                style={{ color: theme.text, fontFamily: fonts.medium }}
                onPress={() => navigation.navigate('UserProfile', { alias: part.slice(1) })}
              >
                {part}
              </Text>
            );
          }
          return <Text key={i}>{part}</Text>;
        })}
      </Text>
    );
  }

  if (deleted) return null;

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', { alias: post.author_alias })}
          activeOpacity={0.7}
        >
          <Avatar name={post.author_name ?? post.author_alias} url={post.author_avatar} />
        </TouchableOpacity>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>
            {post.author_name ?? post.author_alias}
          </Text>
          <Text style={{ fontSize: 13, color: theme.textMuted, fontFamily: fonts.regular }}>
            @{post.author_alias} · {getTimeAgo(new Date(post.created_at))}
          </Text>
        </View>
        {isMine ? (
          <TouchableOpacity onPress={openMenu} activeOpacity={0.6} style={{ padding: 6 }}>
            <MoreIcon size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Body con hashtags/mentions clickeables */}
      {post.body ? renderBody(post.body) : null}

      {/* Imagen */}
      {imageUrl ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image
            source={{ uri: imageUrl ?? undefined }}
            style={{ width: '100%', height: 240, borderRadius: 8, marginBottom: 12 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : null}

      {/* Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 4 }}>
        <TouchableOpacity onPress={toggleLike} disabled={busy} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <HeartIcon size={20} color={liked ? theme.danger : theme.textMuted} filled={liked} />
          {likesCount > 0 ? (
            <Text style={{ color: liked ? theme.danger : theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              {likesCount}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity onPress={onComment} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <CommentIcon size={20} color={theme.textMuted} />
          {(post.comments_count ?? 0) > 0 ? (
            <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              {post.comments_count}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <ShareIcon size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
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
