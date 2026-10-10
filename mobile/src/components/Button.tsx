import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

interface Props {
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ onPress, variant = 'primary', size = 'md', children, loading, disabled, style }: Props) {
  const theme = useTheme();
  const sizes = {
    sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14 },
    md: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 15 },
    lg: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 16 },
  };
  const s = sizes[size];
  const isDisabled = disabled || loading;
  const opacity = isDisabled ? 0.5 : 1;

  // Primary: gradiente purple → cyan
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.8} style={[{ opacity }, style]}>
        <LinearGradient
          colors={["#FFFFFF", "#D4D4D4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
          }}
        >
          {loading ? <ActivityIndicator color="#050505" />
            : <Text style={{ color: '#050505', fontSize: s.fontSize, fontFamily: fonts.medium, letterSpacing: 0.3 }}>{children}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Otros variants (secondary, ghost, danger)
  const variants = {
    secondary: { bg: 'transparent', color: theme.text, border: theme.border },
    ghost: { bg: 'transparent', color: theme.text, border: 'transparent' },
    danger: { bg: theme.danger, color: 'white', border: 'transparent' },
  };
  const v = variants[variant as 'secondary' | 'ghost' | 'danger'];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: 1,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          opacity,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={v.color} />
        : <Text style={{ color: v.color, fontSize: s.fontSize, fontFamily: fonts.medium, letterSpacing: 0.3 }}>{children}</Text>}
    </TouchableOpacity>
  );
}
