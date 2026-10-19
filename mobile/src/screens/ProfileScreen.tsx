import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme, useThemeStore } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { PostGrid } from '../components/PostGrid';
import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';
import { StatsHero } from '../components/StatsHero';
import { Skeleton } from '../components/Skeleton';
import { ScreenBackground } from '../components/ScreenBackground';

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user, clearAuth } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [vibes, setVibes] = useState<any[]>([]);
  const [legacyVibes, setLegacyVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [tab, setTab] = useState<ProfileTab>('posts');

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.profile.get(user.alias);
      setProfile(res);
      if ((res?.user as any)?.accent_color) {
        useThemeStore.getState().setAccent((res.user as any).accent_color);
      }
      const [postsRes, vibesRes, legacyRes] = await Promise.all([
        api.posts.userPosts(res.user.id),
        api.vibes.userVibes(user.alias).catch(() => ({ vibes: [] })),
        api.vibes.legacy({ limit: 50 }).catch(() => ({ vibes: [] })),
      ]);
      setPosts(postsRes.posts ?? []);
      setVibes(vibesRes.vibes ?? []);
      setLegacyVibes((legacyRes.vibes ?? []).filter((v: any) => v.author_id === res.user.id));
    } catch {}
    setLoading(false);
  }

  useFocusEffect(useCallback(() => { load(); }, [user?.alias]));

  useEffect(() => {
    (async () => {
      const u = profile?.user;
      if (!u) { setAvatarUri(null); return; }
      setAvatarUri(await resolveAssetUrl(u.avatar_url));
    })();
  }, [profile]);

  if (loading || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScreenBackground variant="topo" />
        <View style={{ paddingTop: 60, paddingHorizontal: 20 }}><Skeleton width={100} height={24} /></View>
      </View>
    );
  }

  const u = profile.user;
  const stats = profile.stats;
  const photoPosts = posts.filter((p: any) => p.image_url || p.video_url);
  const textPosts = posts.filter((p: any) => !p.image_url && !p.video_url);

  let parsedLinks: {title: string, url: string}[] = [];
  if (u.links) {
    try { parsedLinks = JSON.parse(u.links); } catch {}
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color: theme.text, fontFamily: fonts.displayBoldItalic }}>Perfil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>Ajustes</Text></TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginTop: 12 }}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={{ width: 96, height: 96, borderRadius: 48 }} />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: theme.surfaceElevated, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.text, fontSize: 36, fontFamily: fonts.displayBoldItalic }}>{(u.name ?? u.alias).charAt(0).toUpperCase()}</Text>
          </View>
        )}
        
        {/* Nombre y Badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 }}>
          <Text style={{ color: theme.text, fontSize: 22, fontFamily: fonts.medium }}>{u.name ?? u.alias}</Text>
          {u.account_type && u.account_type !== 'personal' && (
            <View style={{ backgroundColor: theme.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
              <Text style={{ color: 'white', fontSize: 10, fontFamily: fonts.medium, textTransform: 'uppercase' }}>{u.account_type === 'business' ? 'Empresa' : 'Creador'}</Text>
            </View>
          )}
        </View>

        <Text style={{ color: theme.textMuted, fontSize: 14, fontFamily: fonts.regular }}>@{u.alias}</Text>
        
        {/* Categoría */}
        {u.category ? (
          <Text style={{ color: theme.accent, fontSize: 12, fontFamily: fonts.medium, marginTop: 4 }}>{u.category}</Text>
        ) : null}

        {u.bio ? (
          <Text style={{ color: theme.text, fontSize: 14, marginTop: 10, textAlign: 'center', paddingHorizontal: 32, fontFamily: fonts.regular }}>{u.bio}</Text>
        ) : null}

        {/* Enlaces */}
        {parsedLinks.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12, paddingHorizontal: 20 }}>
            {parsedLinks.map((link, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => Linking.openURL(link.url)}
                style={{ backgroundColor: theme.surfaceElevated, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: theme.border }}
              >
                <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 12 }}>{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <StatsHero stats={stats} joinedAt={u.created_at ? String(u.created_at).slice(0, 10).replace(/-/g, '.') : undefined} />

      <View style={{ paddingHorizontal: 32, marginTop: 20, marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      <ProfileTabs active={tab} onChange={setTab} />

      <View style={{ padding: 2 }}>
        {tab === 'posts' ? (
          <PostGrid posts={photoPosts.length > 0 ? photoPosts : posts} />
        ) : tab === 'notas' ? (
          <View style={{ padding: 16 }}>
            {textPosts.map((p) => (
              <View key={p.id} style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14 }}>{p.body}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <TouchableOpacity onPress={() => clearAuth()} style={{ paddingVertical: 14, borderRadius: 8, alignItems: 'center', backgroundColor: theme.danger }}>
          <Text style={{ color: '#FFFFFF', fontFamily: fonts.medium, fontSize: 14 }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
