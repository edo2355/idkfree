import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ProfileIcon({ size = 24, color = '#FFFFFF', strokeWidth = 1.6 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={8.5}
        r={3.8}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M4.8 19.5 C4.8 15.5 7.8 13.5 12 13.5 C16.2 13.5 19.2 15.5 19.2 19.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
