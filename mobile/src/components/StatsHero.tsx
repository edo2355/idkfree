import { View, Text } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

const MONO = 'monospace';

interface Props {
  stats: { posts: number; followers: number; following: number };
  level?: number;
  joinedAt?: string;
}

export function StatsHero({ stats, level, joinedAt }: Props) {
  const theme = useTheme();
  const lvl = level ?? Math.max(1, Math.floor((stats.posts + stats.followers + stats.following) / 5));

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
      {/* Números grandes estilo OSHIMA */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(stats.posts).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            POSTS
          </Text>
        </View>
        <View style={{ width: 1, height: 40, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(stats.followers).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            FLWR
          </Text>
        </View>
        <View style={{ width: 1, height: 40, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(stats.following).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            FLNG
          </Text>
        </View>
        <View style={{ width: 1, height: 40, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(lvl).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            LEVEL
          </Text>
        </View>
      </View>

      {/* Metadata */}
      {joinedAt ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 1.5 }}>
            SINCE {joinedAt}
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9 }}>·</Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 1.5 }}>
            ● ACTIVE
          </Text>
        </View>
      ) : null}
    </View>
  );
}
