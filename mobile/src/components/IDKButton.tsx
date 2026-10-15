// ============================================================
// IDKButton.tsx — Botón con barra de carga animada
// Al tocar → barra llena de izq a der → verde si OK / rojo si falla
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity, Text, ViewStyle, Animated, StyleSheet, Easing,
} from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  onPress: () => Promise<boolean | void> | boolean | void;
  children: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  loadingDuration?: number; // cuánto tarda la barra en llenarse durante loading (default 700ms)
  successDuration?: number;
  errorDuration?: number;
  successColor?: string;
  errorColor?: string;
}

const SUCCESS_DEFAULT = '#22C55E';
const ERROR_DEFAULT = '#EF4444';

export function IDKButton({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  loadingDuration = 700,
  successDuration = 900,
  errorDuration = 1200,
  successColor = SUCCESS_DEFAULT,
  errorColor = ERROR_DEFAULT,
}: Props) {
  const theme = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const progress = useRef(new Animated.Value(0)).current; // 0..1 ancho barra

  const sizes = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 },
    md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 13 },
    lg: { paddingVertical: 16, paddingHorizontal: 20, fontSize: 14 },
  };
  const s = sizes[size];
  const isDisabled = disabled || status === 'loading';

  // Reset tras éxito/error → barra se contrae y vuelve a idle
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const duration = status === 'success' ? successDuration : errorDuration;
      const t = setTimeout(() => {
        Animated.timing(progress, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => setStatus('idle'));
      }, duration);
      return () => clearTimeout(t);
    }
  }, [status]);

  async function handlePress() {
    if (isDisabled) return;

    setStatus('loading');
    progress.setValue(0);

    // Barra que llena de 0 → 0.7 durante el loading (indeterminado hasta ~70%)
    Animated.timing(progress, {
      toValue: 0.7,
      duration: loadingDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    let ok = false;
    try {
      const result = await onPress();
      ok = result !== false;
    } catch (e) {
      ok = false;
    }

    // La barra salta a 1 y se colorea
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    // Color final
    setStatus(ok ? 'success' : 'error');
  }

  // Colores según estado
  const fillColor =
    status === 'success' ? successColor :
    status === 'error' ? errorColor :
    variant === 'danger' ? theme.danger :
    variant === 'primary' ? '#FFFFFF' :
    theme.accent ?? '#FFFFFF';

  const textColor =
    status === 'success' ? successColor :
    status === 'error' ? errorColor :
    variant === 'primary' ? '#050505' :
    variant === 'danger' ? theme.danger :
    theme.text;

  // Ancho de la barra: 0..100%
  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Opacidad del texto (mantiene legible encima de la barra)
  const textOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.55, 0],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.button,
        {
          borderColor: variant === 'primary' ? 'transparent' : theme.border,
          backgroundColor: variant === 'primary' ? '#FFFFFF' : 'transparent',
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          opacity: isDisabled && status === 'idle' ? 0.5 : 1,
        },
        style,
      ]}
    >
      {/* Barra de carga (capa inferior) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: fillColor,
            width: barWidth,
            opacity: status === 'loading' || status === 'success' || status === 'error' ? 1 : 0,
          },
        ]}
        pointerEvents="none"
      />

      {/* Texto (capa superior) */}
      <Animated.Text
        style={[
          styles.text,
          {
            color: status === 'loading' || status === 'success' || status === 'error'
              ? '#050505'
              : textColor,
            fontSize: s.fontSize,
            opacity:
              status === 'success' || status === 'error'
                ? 1
                : textOpacity,
          },
        ]}
        numberOfLines={1}
      >
        {status === 'success' ? '✓ ' + children :
         status === 'error' ? '✗ ' + children :
         children}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    overflow: 'hidden',
    position: 'relative',
  },
  text: {
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
