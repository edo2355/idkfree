// ============================================================
// IDKButton.tsx — Botón con feedback visual (verde/rojo)
// Al tocar → carga → verde si OK / rojo si falla → vuelve
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator, ViewStyle, Animated,
  View, StyleSheet,
} from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  // Handler: devuelve true/void (éxito) o false/throws (fallo)
  onPress: () => Promise<boolean | void> | boolean | void;
  // Si no se pasa onPress, o se quiere solo una acción simple, usar onValidated
  children: string;
  // Estilos base
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  // Personalización del feedback
  successDuration?: number; // default 800ms
  errorDuration?: number;   // default 1200ms
  // Colores custom (opcionales)
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
  successDuration = 800,
  errorDuration = 1200,
  successColor = SUCCESS_DEFAULT,
  errorColor = ERROR_DEFAULT,
}: Props) {
  const theme = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const scale = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current; // 0..1 → control de overlay

  const sizes = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 },
    md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 13 },
    lg: { paddingVertical: 16, paddingHorizontal: 20, fontSize: 14 },
  };
  const s = sizes[size];
  const isDisabled = disabled || status === 'loading';

  // Reset visual tras éxito/error
  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(() => {
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start(() => setStatus('idle'));
      }, successDuration);
      return () => clearTimeout(t);
    }
    if (status === 'error') {
      const t = setTimeout(() => {
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start(() => setStatus('idle'));
      }, errorDuration);
      return () => clearTimeout(t);
    }
  }, [status]);

  async function handlePress() {
    if (isDisabled) return;

    // Feedback táctil: pequeño "pop"
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 70, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    setStatus('loading');

    let ok = false;
    try {
      const result = await onPress();
      // Éxito si NO devuelve false explícito
      ok = result !== false;
    } catch (e) {
      ok = false;
    }

    if (ok) {
      setStatus('success');
      Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    } else {
      setStatus('error');
      Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    }
  }

  // Colores por estado
  const borderColor = status === 'success' ? successColor
    : status === 'error' ? errorColor
    : variant === 'danger' ? theme.danger
    : variant === 'primary' ? '#FFFFFF'
    : theme.border;

  const bgColor = status === 'success' ? 'rgba(34,197,94,0.15)'
    : status === 'error' ? 'rgba(239,68,68,0.15)'
    : variant === 'primary' ? '#FFFFFF'
    : variant === 'danger' ? 'rgba(239,68,68,0.1)'
    : 'transparent';

  const textColor = status === 'success' ? successColor
    : status === 'error' ? errorColor
    : variant === 'primary' ? '#050505'
    : variant === 'danger' ? theme.danger
    : theme.text;

  const indicatorColor = variant === 'primary' && status === 'loading' ? '#050505' : theme.text;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
            borderColor,
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
            opacity: isDisabled && status !== 'loading' ? 0.5 : 1,
          },
        ]}
      >
        {status === 'loading' ? (
          <ActivityIndicator color={indicatorColor} size="small" />
        ) : (
          <Text style={[styles.text, { color: textColor, fontSize: s.fontSize }]}>
            {status === 'success' ? '✓ ' + children.toUpperCase() : null}
            {status === 'error' ? '✗ ' + children.toUpperCase() : null}
            {status === 'idle' ? children : null}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
