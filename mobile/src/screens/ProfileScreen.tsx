import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { PostCard } from '../components/PostCard';

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user, clearAuth } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.profile.get(user.alias);
      setProfile(res);
      const postsRes = await api.posts.userPosts(res.user.id);
      setPosts(postsRes.posts ?? []);
    } catch {}
    setLoading(false);
  }

  useFocusEffect(useCallback(() => { load(); }, [user?.alias]));

  useEffect(() => {
    (async () => {
      const u = profile?.user;
      if (!u) { setAvatarUri(null); return; }
      const resolved = await resolveAssetUrl(u.avatar_url);
      setAvatarUri(resolved);
    })();
  }, [profile]);

  function handleLogout() {
    clearAuth();
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
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
          Perfil
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.6}>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>Ajustes</Text>
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

      {/* Botón Editar perfil */}
      <View style={{ paddingHorizontal: 32, marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}
          style={{
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
            Editar perfil
          </Text>
        </TouchableOpacity>
      </View>

      {/* Posts propios */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={{ color: theme.text, fontSize: 15, fontFamily: fonts.medium, marginBottom: 12 }}>
          Mis posts
        </Text>
        {posts.length === 0 ? (
          <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 30, fontFamily: fonts.regular }}>
            Aún no has publicado nada
          </Text>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </View>

      {/* Cerrar sesión */}
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          style={{
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: theme.danger,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: fonts.medium, fontSize: 14 }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
