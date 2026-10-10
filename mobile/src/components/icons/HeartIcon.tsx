import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
}

export function HeartIcon({ size = 22, color = '#FFFFFF', filled = false, strokeWidth = 1.8 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20.5 C12 20.5 3.5 15 3.5 9 C3.5 6 5.8 4 8.2 4 C10 4 11.3 5 12 6.3 C12.7 5 14 4 15.8 4 C18.2 4 20.5 6 20.5 9 C20.5 15 12 20.5 12 20.5 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}
