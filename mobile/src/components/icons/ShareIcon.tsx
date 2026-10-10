import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ShareIcon({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={6} cy={12} r={2.3} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={18} cy={6} r={2.3} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={18} cy={18} r={2.3} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 11 L16 7 M8 13 L16 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
