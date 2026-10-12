import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { PostCard } from '../components/PostCard';

export function UserProfileScreen() {
  const theme = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const alias: string = route.params?.alias;

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.profile.get(alias);
      setProfile(res);
      const postsRes = await api.posts.userPosts(res.user.id);
      setPosts(postsRes.posts ?? []);
    } catch (e) { console.log('profile error', e); }
    setLoading(false);
  }

  useFocusEffect(useCallback(() => { load(); }, [alias]));

  useEffect(() => {
    (async () => {
      if (!profile?.user) { setAvatarUri(null); return; }
      const resolved = await resolveAssetUrl(profile.user.avatar_url);
      setAvatarUri(resolved);
    })();
  }, [profile]);

  async function toggleFollow() {
    if (!profile || busy || profile.is_me) return;
    setBusy(true);
    const wasFollowing = profile.is_following;
    try {
      if (wasFollowing) await api.follows.unfollow(profile.user.id);
      else await api.follows.follow(profile.user.id);
      setProfile({
        ...profile,
        is_following: !wasFollowing,
        stats: {
          ...profile.stats,
          followers: wasFollowing ? profile.stats.followers - 1 : profile.stats.followers + 1,
        },
      });
    } catch {}
    setBusy(false);
  }

  if (loading || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  const u = profile.user;
  const stats = profile.stats;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header top bar */}
      <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={{ width: 96, height: 96, borderRadius: 48 }} />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: theme.surfaceElevated, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.text, fontSize: 36, fontFamily: fonts.displayBoldItalic }}>
              {(u.name ?? u.alias).charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={{ color: theme.text, fontSize: 22, marginTop: 12, fontFamily: fonts.medium }}>
          {u.name ?? u.alias}
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 14, fontFamily: fonts.regular }}>
          @{u.alias}
        </Text>
        {u.bio ? (
          <Text style={{ color: theme.text, fontSize: 14, marginTop: 10, textAlign: 'center', paddingHorizontal: 32, fontFamily: fonts.regular, lineHeight: 20 }}>
            {u.bio}
          </Text>
        ) : null}
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 32 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.posts}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Posts</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.followers}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Seguidores</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.following}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Siguiendo</Text>
        </View>
      </View>

      {/* Botón seguir */}
      {!profile.is_me ? (
        <View style={{ paddingHorizontal: 32, marginTop: 20 }}>
          <TouchableOpacity
            onPress={toggleFollow}
            disabled={busy}
            activeOpacity={0.7}
            style={{
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: profile.is_following ? 'transparent' : theme.text,
              borderWidth: profile.is_following ? 1 : 0,
              borderColor: theme.border,
            }}
          >
            <Text style={{ color: profile.is_following ? theme.text : theme.bg, fontFamily: fonts.medium, fontSize: 14 }}>
              {profile.is_following ? 'Siguiendo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Posts */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={{ color: theme.text, fontSize: 15, fontFamily: fonts.medium, marginBottom: 12 }}>
          Posts
        </Text>
        {posts.length === 0 ? (
          <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 30, fontFamily: fonts.regular }}>
            Sin posts todavía
          </Text>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </View>
    </ScrollView>
  );
}
