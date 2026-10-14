import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActionSheetIOS, Platform, ActivityIndicator, Animated, Pressable, Modal, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { resolveAssetUrl as resolveAsset } from '../utils/assetUrl';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { Avatar } from './Avatar';
import { HeartIcon } from './icons/HeartIcon';
import { CommentIcon } from './icons/CommentIcon';
import { ShareIcon } from './icons/ShareIcon';
import { RepostIcon } from './icons/RepostIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { MoreIcon } from './icons/MoreIcon';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingsViewer } from './DrawingsViewer';
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
  const [showDrawing, setShowDrawing] = useState(false);
  const [showDrawings, setShowDrawings] = useState(false);
  const [drawingsCount, setDrawingsCount] = useState(0);
  const [reposting, setReposting] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastTapRef = useRef<number>(0);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    resolveAssetUrl(post.image_url).then((u) => { console.log("IMG URL:", u); setImageUrl(u); });
  }, [post.image_url]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.posts.drawings(post.id);
        setDrawingsCount((res.drawings ?? []).length);
      } catch {}
    })();
  }, [post.id]);

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

  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap
      if (!liked && !busy) {
        toggleLike();
      }
      // Animar corazón
      heartScale.setValue(0.5);
      heartOpacity.setValue(1);
      Animated.parallel([
        Animated.spring(heartScale, { toValue: 1.2, useNativeDriver: true, friction: 3 }),
        Animated.timing(heartOpacity, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
      ]).start();
    }
    lastTapRef.current = now;
  }

  async function doRepost() {
    if (reposting) return;
    setReposting(true);
    try {
      await api.posts.repost(post.id, undefined);
      Alert.alert('Reposteado', 'Aparecerá en tu perfil');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo repostear');
    }
    setReposting(false);
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
    <Pressable
      onPress={handleDoubleTap}
      delayLongPress={400}
      style={{
        backgroundColor: theme.bg,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        paddingTop: 12,
        paddingBottom: 12,
        position: 'relative',
        marginBottom: 0,
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

      {/* Video o Imagen */}
      {post.video_url ? (
        <PostVideo videoUrl={post.video_url} />
      ) : imageUrl ? (
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
          <HeartIcon size={22} color={liked ? theme.accent : theme.textMuted} filled={liked} />
          {likesCount > 0 ? (
            <Text style={{ color: liked ? theme.danger : theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              {likesCount}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity onPress={onComment} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.textMuted} />
          {(post.comments_count ?? 0) > 0 ? (
            <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              {post.comments_count}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <ShareIcon size={22} color={theme.textMuted} />
        </TouchableOpacity>

        {/* Republicar */}
        <TouchableOpacity onPress={doRepost} disabled={reposting} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <Text style={{ fontSize: 20, opacity: reposting ? 0.3 : 0.5 }}>🔁</Text>
        </TouchableOpacity>

        {/* Dibujar (solo si NO es tuyo) */}
        {!isMine && imageUrl ? (
          <TouchableOpacity onPress={() => setShowDrawing(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
            <Text style={{ fontSize: 18, color: theme.textMuted }}>✏️</Text>
          </TouchableOpacity>
        ) : null}

        {/* Ver dibujos (si hay) */}
        {drawingsCount > 0 ? (
          <TouchableOpacity onPress={() => setShowDrawings(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
            <Text style={{ fontSize: 14, color: theme.textMuted }}>🎨</Text>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 12 }}>
              {drawingsCount}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Modales */}
      {showDrawing && imageUrl ? (
        <DrawingCanvas
          postId={post.id}
          imageUrl={post.image_url ?? ''}
          onClose={() => setShowDrawing(false)}
          onSaved={() => { setShowDrawing(false); setDrawingsCount((c) => c + 1); }}
        />
      ) : null}

      <DrawingsViewer
        postId={post.id}
        visible={showDrawings}
        onClose={() => setShowDrawings(false)}
      />

      {/* Corazón flotante al doble tap */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: '40%',
          left: '42%',
          opacity: heartOpacity,
          transform: [{ scale: heartScale }],
        }}
      >
        <HeartIcon size={110} color={theme.accent} filled />
      </Animated.View>
    </Pressable>
  );
}

function PostVideo({ videoUrl }: { videoUrl: string }) {
  const [uri, setUri] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await resolveAsset(videoUrl);
      if (!cancelled) setUri(resolved);
    })();
    return () => { cancelled = true; };
  }, [videoUrl]);

  if (!uri) {
    return (
      <View style={{ width: '100%', height: 320, borderRadius: 8, backgroundColor: '#000', marginBottom: 12, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FFF" />
      </View>
    );
  }

  return <VideoPlayerInner uri={uri} muted={muted} onToggleMute={() => setMuted((m) => !m)} />;
}

function VideoPlayerInner({ uri, muted, onToggleMute }: { uri: string; muted: boolean; onToggleMute: () => void }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = muted;
    p.play();
  });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  return (
    <View style={{ position: 'relative', marginBottom: 12 }}>
      <VideoView
        player={player}
        style={{ width: '100%', height: 320, borderRadius: 8, backgroundColor: '#000' }}
        contentFit="contain"
        nativeControls={false}
      />
      <TouchableOpacity
        onPress={onToggleMute}
        activeOpacity={0.7}
        style={{ position: 'absolute', bottom: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: '#FFF', fontSize: 16 }}>{muted ? '🔇' : '🔊'}</Text>
      </TouchableOpacity>
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
