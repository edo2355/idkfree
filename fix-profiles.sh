#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree || exit 1

echo "════════════════════════════════════════════════════"
echo "  PERFILES con tabs + grid IG"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Migración 015 (si falta) ----------
echo "▸ 1. Verificar migración 015"
cd backend
MIG_COUNT=$(node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('./aldea.db');
const row = db.prepare(\"SELECT COUNT(*) AS n FROM migrations WHERE name='015_legacy_vibes.sql'\").get();
console.log(row.n);
")
if [ "$MIG_COUNT" = "0" ]; then
  cat > src/db/migrations/015_legacy_vibes.sql << 'SQL'
-- ============================================================
-- 015_legacy_vibes.sql — Vibes legacy + media
-- ============================================================
ALTER TABLE vibes ADD COLUMN is_legacy INTEGER NOT NULL DEFAULT 0;
ALTER TABLE vibes ADD COLUMN media_url TEXT;
CREATE INDEX IF NOT EXISTS idx_vibes_legacy ON vibes(author_id, is_legacy);
SQL
  echo "  ✅ migración creada"
  mkdir -p dist/db/migrations && cp src/db/migrations/*.sql dist/db/migrations/
  node dist/db/migrate.js 2>&1 | tail -3
else
  echo "  ·  ya aplicada"
fi
cd ..

# ---------- 2. ProfileTabs ----------
echo ""
echo "▸ 2. ProfileTabs.tsx"
cat > mobile/src/components/ProfileTabs.tsx << 'TSX'
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

export type ProfileTab = 'posts' | 'notas' | 'legacy';

interface Props {
  active: ProfileTab;
  onChange: (t: ProfileTab) => void;
  showLegacy?: boolean;
}

export function ProfileTabs({ active, onChange, showLegacy = true }: Props) {
  const theme = useTheme();
  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'posts', label: 'POSTS' },
    { key: 'notas', label: 'NOTAS' },
  ];
  if (showLegacy) tabs.push({ key: 'legacy', label: 'LEGACY' });

  return (
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: theme.border, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.key}
          onPress={() => onChange(t.key)}
          activeOpacity={0.7}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderBottomWidth: active === t.key ? 2 : 0,
            borderBottomColor: theme.text,
          }}
        >
          <Text style={{
            color: active === t.key ? theme.text : theme.textMuted,
            fontFamily: fonts.medium,
            fontSize: 11,
            letterSpacing: 1.5,
          }}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
TSX
echo "  ✅"

# ---------- 3. PostGrid ----------
echo "▸ 3. PostGrid.tsx"
cat > mobile/src/components/PostGrid.tsx << 'TSX'
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { resolveAssetUrl } from '../utils/assetUrl';

const { width: SCREEN_W } = Dimensions.get('window');
const GAP = 2;
const SIZE = (SCREEN_W - GAP * 2) / 3;

interface Props {
  posts: any[];
}

function GridCell({ post }: { post: any }) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const u = await resolveAssetUrl(post.image_url);
      setUri(u);
    })();
  }, [post.image_url]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('UserProfile', { alias: post.author_alias })}
      style={{ width: SIZE, height: SIZE, backgroundColor: theme.surface }}
    >
      {uri ? (
        <Image source={{ uri: uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <View style={{ flex: 1, padding: 6, justifyContent: 'space-between' }}>
          <Text style={{ color: theme.text, fontSize: 10, lineHeight: 13 }} numberOfLines={4}>
            {post.body ?? ''}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 8 }} numberOfLines={1}>
            @{post.author_alias}
          </Text>
        </View>
      )}
      {post.video_url ? (
        <View style={{ position: 'absolute', top: 4, right: 4 }}>
          <Text style={{ color: '#FFF', fontSize: 12 }}>▶</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export function PostGrid({ posts }: Props) {
  const theme = useTheme();

  if (posts.length === 0) {
    return (
      <View style={{ paddingVertical: 60, alignItems: 'center' }}>
        <Text style={{ fontSize: 32, marginBottom: 8 }}>📷</Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13 }}>
          Sin posts todavía
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
      {posts.map((p) => <GridCell key={p.id} post={p} />)}
    </View>
  );
}
TSX
echo "  ✅"

# ---------- 4. ProfileScreen con tabs ----------
echo "▸ 4. ProfileScreen con tabs"
cat > mobile/src/screens/ProfileScreen.tsx << 'TSX'
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { PostGrid } from '../components/PostGrid';
import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';

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
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  const u = profile.user;
  const stats = profile.stats;
  const photoPosts = posts.filter((p: any) => p.image_url || p.video_url);
  const textPosts = posts.filter((p: any) => !p.image_url && !p.video_url);

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

      {/* Avatar + info */}
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

      {/* Botón editar */}
      <View style={{ paddingHorizontal: 32, marginTop: 20, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}
          style={{ paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.border }}
        >
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ProfileTabs active={tab} onChange={setTab} />

      {/* Contenido */}
      <View style={{ padding: 2 }}>
        {tab === 'posts' ? (
          <PostGrid posts={photoPosts.length > 0 ? photoPosts : posts} />
        ) : tab === 'notas' ? (
          <View style={{ padding: 16 }}>
            {textPosts.length === 0 && vibes.length === 0 ? (
              <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 40, fontFamily: fonts.regular }}>
                Sin notas todavía
              </Text>
            ) : (
              <>
                {textPosts.map((p) => (
                  <View key={p.id} style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                      {p.body}
                    </Text>
                  </View>
                ))}
                {vibes.map((v) => (
                  <View key={v.id} style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                      {v.message}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            {legacyVibes.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🕯️</Text>
                <Text style={{ color: theme.textMuted, textAlign: 'center', fontFamily: fonts.regular, fontSize: 13 }}>
                  Sin contenido legacy
                </Text>
              </View>
            ) : (
              legacyVibes.map((v) => (
                <View key={v.id} style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                    {v.message}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      {/* Logout */}
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => clearAuth()}
          activeOpacity={0.7}
          style={{ paddingVertical: 14, borderRadius: 8, alignItems: 'center', backgroundColor: theme.danger }}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: fonts.medium, fontSize: 14 }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
TSX
echo "  ✅"

# ---------- 5. UserProfileScreen con tabs ----------
echo "▸ 5. UserProfileScreen con tabs"
cat > mobile/src/screens/UserProfileScreen.tsx << 'TSX'
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { PostGrid } from '../components/PostGrid';
import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';

export function UserProfileScreen() {
  const theme = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const alias: string = route.params?.alias;
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [vibes, setVibes] = useState<any[]>([]);
  const [legacyVibes, setLegacyVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [tab, setTab] = useState<ProfileTab>('posts');

  async function load() {
    setLoading(true);
    try {
      const res = await api.profile.get(alias);
      setProfile(res);
      const [postsRes, vibesRes, legacyRes] = await Promise.all([
        api.posts.userPosts(res.user.id),
        api.vibes.userVibes(alias).catch(() => ({ vibes: [] })),
        api.vibes.legacy({ limit: 50 }).catch(() => ({ vibes: [] })),
      ]);
      setPosts(postsRes.posts ?? []);
      setVibes(vibesRes.vibes ?? []);
      setLegacyVibes((legacyRes.vibes ?? []).filter((v: any) => v.author_id === res.user.id));
    } catch (e) { console.log('profile error', e); }
    setLoading(false);
  }

  useFocusEffect(useCallback(() => { load(); }, [alias]));

  useEffect(() => {
    (async () => {
      if (!profile?.user) { setAvatarUri(null); return; }
      setAvatarUri(await resolveAssetUrl(profile.user.avatar_url));
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
  const photoPosts = posts.filter((p: any) => p.image_url || p.video_url);
  const textPosts = posts.filter((p: any) => !p.image_url && !p.video_url);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Back */}
      <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar + info */}
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
        <View style={{ paddingHorizontal: 32, marginTop: 20, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={toggleFollow}
            disabled={busy}
            activeOpacity={0.7}
            style={{
              paddingVertical: 12, borderRadius: 8, alignItems: 'center',
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

      {/* Tabs */}
      <ProfileTabs active={tab} onChange={setTab} />

      {/* Contenido */}
      <View style={{ padding: 2 }}>
        {tab === 'posts' ? (
          <PostGrid posts={photoPosts.length > 0 ? photoPosts : posts} />
        ) : tab === 'notas' ? (
          <View style={{ padding: 16 }}>
            {textPosts.length === 0 && vibes.length === 0 ? (
              <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 40, fontFamily: fonts.regular }}>
                Sin notas
              </Text>
            ) : (
              <>
                {textPosts.map((p) => (
                  <View key={p.id} style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                      {p.body}
                    </Text>
                  </View>
                ))}
                {vibes.map((v) => (
                  <View key={v.id} style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                      {v.message}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            {legacyVibes.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🕯️</Text>
                <Text style={{ color: theme.textMuted, textAlign: 'center', fontFamily: fonts.regular, fontSize: 13 }}>
                  Sin contenido legacy
                </Text>
              </View>
            ) : (
              legacyVibes.map((v) => (
                <View key={v.id} style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }}>
                    {v.message}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
TSX
echo "  ✅"

# ---------- 6. Typecheck ----------
echo ""
echo "▸ 6. Typecheck mobile"
cd mobile
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi
cd ..

# ---------- 7. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 7. Commit + push"
  git add -A
  git commit -m "feat(profiles): tabs POSTS/NOTAS/LEGACY + grid IG + PostGrid + ProfileTabs" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ PERFILES con tabs listos"
echo "════════════════════════════════════════════════════"
