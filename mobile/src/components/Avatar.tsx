import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { resolveAssetUrl } from '../utils/assetUrl';

interface Props { name?: string | null; url?: string | null; size?: number; }

export function Avatar({ name, url, size = 40 }: Props) {
  const theme = useTheme();
  const initial = name?.[0]?.toUpperCase() ?? '?';
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!url) { if (!cancelled) setResolved(null); return; }
      const u = await resolveAssetUrl(url);
      if (!cancelled) setResolved(u);
    })();
    return () => { cancelled = true; };
  }, [url]);

  if (resolved) {
    return <Image source={{ uri: resolved }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: theme.border, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.45, fontWeight: '600', color: theme.text }}>{initial}</Text>
    </View>
  );
}
