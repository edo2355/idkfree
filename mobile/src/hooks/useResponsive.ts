import { useWindowDimensions } from 'react-native';

export interface Responsive {
  width: number;
  height: number;
  isSmall: boolean;   // < 380 (móviles pequeños tipo Galaxy A0x)
  isMedium: boolean;  // 380-450
  isLarge: boolean;   // > 450 (tablets/grandes)
  scale: number;      // factor para tamaños proporcionales
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  font: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
}

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 380;
  const isMedium = width >= 380 && width <= 450;
  const isLarge = width > 450;

  // Base de referencia: iPhone 12 (390px). Scale se ajusta 0.85–1.15
  const scale = Math.max(0.85, Math.min(1.15, width / 390));

  const spacing = {
    xs: Math.round(4 * scale),
    sm: Math.round(8 * scale),
    md: Math.round(12 * scale),
    lg: Math.round(16 * scale),
    xl: Math.round(24 * scale),
  };

  const font = {
    xs: Math.round(11 * scale),
    sm: Math.round(13 * scale),
    md: Math.round(15 * scale),
    lg: Math.round(18 * scale),
    xl: Math.round(22 * scale),
    xxl: Math.round(26 * scale),
  };

  return { width, height, isSmall, isMedium, isLarge, scale, spacing, font };
}
