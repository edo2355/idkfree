import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { StoryViewer } from './StoryViewer';

interface Group {
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  stories: any[];
  all_viewed: boolean;
}

export function StoriesRow() {
  const theme = useTheme();
  const me = useAuthStore((s) => s.user);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [avatarUrls, setAvatarUrls] = useState<Record<string, string | null>>({});

  async function load() {
    setLoading(true);
    try {
      const res = await api.stories.feed();
      setGroups(res.stories ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Resolver avatares async
  useEffect(() => {
    (async () => {
      const next: Record<string, string | null> = {};
      for (const g of groups) {
        next[g.author_id] = await resolveAssetUrl(g.author_avatar);
      }
      setAvatarUrls(next);
    })();
  }, [groups]);

  if (loading) {
    return (
      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <>
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12, gap: 14 }}
        >
          {/* Botón + para crear historia */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ alignItems: 'center', width: 68 }}
          >
            <View
              style={{
                width: 60, height: 60, borderRadius: 30,
                borderWidth: 2, borderColor: theme.border, borderStyle: 'dashed',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: theme.surface,
              }}
            >
              <Text style={{ color: theme.text, fontSize: 26, lineHeight: 26 }}>+</Text>
            </View>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 }} numberOfLines={1}>
              Tu historia
            </Text>
          </TouchableOpacity>

          {/* Grupos */}
          {groups.map((g, idx) => {
            const avatar = avatarUrls[g.author_id];
            const ringColor = g.all_viewed ? theme.border : theme.text;
            return (
              <TouchableOpacity
                key={g.author_id}
                activeOpacity={0.7}
                onPress={() => { setStartIndex(idx); setViewerOpen(true); }}
                style={{ alignItems: 'center', width: 68 }}
              >
                <View
                  style={{
                    width: 60, height: 60, borderRadius: 30,
                    borderWidth: 2, borderColor: ringColor,
                    padding: 2,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                  ) : (
                    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 20 }}>
                        {(g.author_name ?? g.author_alias).charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 }} numberOfLines={1}>
                  {g.author_id === me?.id ? 'Tú' : g.author_alias}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {viewerOpen && groups[startIndex] && (
        <StoryViewer
          groups={groups}
          initialGroupIndex={startIndex}
          onClose={() => { setViewerOpen(false); load(); }}
        />
      )}
    </>
  );
}
