import { View, Text, Image } from 'react-native';
import { useTheme } from '../stores/themeStore';

interface Props { name?: string | null; url?: string | null; size?: number; }

export function Avatar({ name, url, size = 40 }: Props) {
  const theme = useTheme();
  const initial = name?.[0]?.toUpperCase() ?? '?';
  if (url) return <Image source={{ uri: url }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: theme.border, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.45, fontWeight: '600', color: theme.text }}>{initial}</Text>
    </View>
  );
}