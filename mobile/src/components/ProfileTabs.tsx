import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

export type ProfileTab = 'posts' | 'reels' | 'streams' | 'notas' | 'legacy';

interface Props {
  active: ProfileTab;
  onChange: (t: ProfileTab) => void;
  showLegacy?: boolean;
}

export function ProfileTabs({ active, onChange, showLegacy = true }: Props) {
  const theme = useTheme();
  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'posts', label: 'POSTS' },
    { key: 'reels', label: 'REELS' },
    { key: 'streams', label: 'STREAMS' },
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
            borderBottomColor: theme.accent,
          }}
        >
          <Text style={{
            color: active === t.key ? theme.text : theme.textMuted,
            fontFamily: fonts.medium,
            fontSize: 10,
            letterSpacing: 1,
          }}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
