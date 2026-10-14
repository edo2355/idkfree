import { useEffect, useRef } from 'react';
import { View, Animated, type ViewStyle } from 'react-native';
import { useTheme } from '../stores/themeStore';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: Props) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.surfaceElevated,
          opacity,
        },
        style,
      ]}
    />
  );
}

// ---------- Skeleton para PostCard ----------
export function PostSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
        <Skeleton width={36} height={36} borderRadius={18} />
        <View style={{ marginLeft: 10, flex: 1, gap: 6 }}>
          <Skeleton width={80} height={12} />
          <Skeleton width={120} height={10} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, gap: 8, marginBottom: 12 }}>
        <Skeleton width="90%" height={12} />
        <Skeleton width="70%" height={12} />
      </View>
      <Skeleton width="100%" height={200} borderRadius={0} />
    </View>
  );
}

// ---------- Skeleton para Masonry ----------
export function MasonrySkeleton() {
  const heights = [220, 140, 180, 260, 120, 200, 160, 240];
  return (
    <View style={{ flexDirection: 'row', gap: 6, padding: 8 }}>
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="100%" height={heights[0]} borderRadius={8} />
        <Skeleton width="100%" height={heights[1]} borderRadius={8} />
        <Skeleton width="100%" height={heights[2]} borderRadius={8} />
        <Skeleton width="100%" height={heights[3]} borderRadius={8} />
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="100%" height={heights[4]} borderRadius={8} />
        <Skeleton width="100%" height={heights[5]} borderRadius={8} />
        <Skeleton width="100%" height={heights[6]} borderRadius={8} />
        <Skeleton width="100%" height={heights[7]} borderRadius={8} />
      </View>
    </View>
  );
}

// ---------- Skeleton para lista de personas ----------
export function UserRowSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 8, marginBottom: 8 }}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={10} />
      </View>
    </View>
  );
}

// ---------- Skeleton para conversaciones ----------
export function ChatRowSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
        <Skeleton width={120} height={12} />
        <Skeleton width="80%" height={10} />
      </View>
    </View>
  );
}

// ---------- Skeleton para notificaciones ----------
export function NotificationSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: theme.surface, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: theme.border }}>
      <Skeleton width={36} height={36} borderRadius={18} />
      <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
        <Skeleton width="70%" height={12} />
        <Skeleton width={60} height={10} />
      </View>
    </View>
  );
}
