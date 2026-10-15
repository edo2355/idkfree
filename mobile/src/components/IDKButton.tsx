// ============================================================
// IDKButton.tsx — Botón con bloques de carga estilo OSHIMA
// Al tocar → bloques se encienden izq→der → verde OK / rojo error
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity, Text, ViewStyle, StyleSheet, View,
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
  blockCount?: number;      // cuántos bloquecitos (default 24)
  loadingDuration?: number; // tiempo total de llenado durante loading
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
  blockCount = 24,
  loadingDuration = 900,
  successDuration = 900,
  errorDuration = 1200,
  successColor = SUCCESS_DEFAULT,
  errorColor = ERROR_DEFAULT,
}: Props) {
  const theme = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const [filled, setFilled] = useState(0); // bloques encendidos (0..blockCount)
  const intervalRef = useRef<any>(null);

  const sizes = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12, blockH: 3 },
    md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 13, blockH: 4 },
    lg: { paddingVertical: 16, paddingHorizontal: 20, fontSize: 14, blockH: 5 },
  };
  const s = sizes[size];
  const isDisabled = disabled || status === 'loading';

  // Al cambiar status, coordinar bloques
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (status === 'loading') {
      // Llenar hasta ~75% mientras espera al backend
      const target = Math.floor(blockCount * 0.75);
      intervalRef.current = setInterval(() => {
        setFilled((f) => {
          if (f >= target) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            return f;
          }
          return f + 1;
        });
      }, Math.max(30, loadingDuration / target));
    }

    if (status === 'success') {
      // Salto rápido a full
      setFilled(blockCount);
    }

    if (status === 'error') {
      // Los bloques se vuelven rojos, no se llenan más
      // (mantienen el nivel donde quedaron)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  // Reset tras éxito/error
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const duration = status === 'success' ? successDuration : errorDuration;
      const t = setTimeout(() => {
        setStatus('idle');
        setFilled(0);
      }, duration);
      return () => clearTimeout(t);
    }
  }, [status]);

  async function handlePress() {
    if (isDisabled) return;

    setStatus('loading');
    setFilled(0);

    let ok = false;
    try {
      const result = await onPress();
      ok = result !== false;
    } catch (e) {
      ok = false;
    }

    setStatus(ok ? 'success' : 'error');
  }

  // Colores por estado
  const activeColor =
    status === 'success' ? successColor :
    status === 'error' ? errorColor :
    variant === 'primary' ? '#050505' :
    variant === 'danger' ? theme.danger :
    (theme.accent ?? '#FFFFFF');

  const bgColor = variant === 'primary' ? '#FFFFFF' : 'transparent';

  const textColor =
    variant === 'primary' ? '#050505' :
    variant === 'danger' ? theme.danger :
    theme.text;

  // En success/error forzamos color del bloque
  const blockColor =
    status === 'success' ? successColor :
    status === 'error' ? errorColor :
    (variant === 'primary' ? '#050505' : (theme.accent ?? '#FFFFFF'));

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.button,
        {
          borderColor: variant === 'primary' ? 'transparent' : theme.border,
          backgroundColor: bgColor,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          opacity: isDisabled && status === 'idle' ? 0.5 : 1,
        },
        style,
      ]}
    >
      {/* Texto */}
      <Text
        style={[
          styles.text,
          {
            color: status === 'error' ? errorColor : textColor,
            fontSize: s.fontSize,
          },
        ]}
        numberOfLines={1}
      >
        {status === 'success' ? '✓ ' + children :
         status === 'error' ? '✗ ' + children :
         children}
      </Text>

      {/* Bloques OSHIMA debajo del texto */}
      <View style={styles.blocksRow} pointerEvents="none">
        {Array.from({ length: blockCount }).map((_, i) => {
          const on = i < filled;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: s.blockH,
                marginHorizontal: 0.5,
                backgroundColor: on ? blockColor : 'rgba(0,0,0,0.12)',
              }}
            />
          );
        })}
      </View>
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
    marginBottom: 6,
  },
  blocksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
});
