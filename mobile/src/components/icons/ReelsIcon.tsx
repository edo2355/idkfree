import Svg, { Path, Rect } from 'react-native-svg';

export function ReelsIcon({ size = 24, color = '#FFF', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth={2} fill={filled ? color : 'none'} />
      <Path d="M3 8h18M8 4l3 4M14 4l3 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10 12l5 3-5 3v-6z" fill={filled ? '#000' : color} />
    </Svg>
  );
}
