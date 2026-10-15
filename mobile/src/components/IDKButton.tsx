// ============================================================
// IDKButton.tsx — Bloques grandes que llenan todo el botón
// Loading: bloques se encienden izq→der hasta 60%
// OK: saltan a 100% en verde
// Error: retroceden a 50% en rojo
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
  blockCount?: number;
  loadingDuration?: number;
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
  blockCount = 20,
  loadingDuration = 900,
  successDuration = 900,
  errorDuration = 1200,
  successColor = SUCCESS_DEFAULT,
  errorColor = ERROR_DEFAULT,
}: Props) {
  const theme = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const [filled, setFilled] = useState(0);
  const intervalRef = useRef<any>(null);

  const sizes = {
    sm: { paddingVertical: 10, paddingHorizontal: 14, fontSize: 12, minHeight: 40 },
    md: { paddingVertical: 14, paddingHorizontal: 18, fontSize: 13, minHeight: 52 },
    lg: { paddingVertical: 18, paddingHorizontal: 20, fontSize: 14, minHeight: 60 },
  };
  const s = sizes[size];
  const isDisabled = disabled || status === 'loading';

  // Fondo del botón base (blanco para primary)
  const baseBg = variant === 'primary' ? '#FFFFFF' : 'transparent';

  // Color base del texto
  const baseTextColor =
    variant === 'primary' ? '#050505' :
    variant === 'danger' ? theme.danger :
    theme.text;

  // Color de los bloques según estado
  const blockColor =
    status === 'success' ? successColor :
    status === 'error' ? errorColor :
    variant === 'primary' ? '#050505' :
    variant === 'danger' ? theme.danger :
    (theme.accent ?? '#FFFFFF');

  // Texto encima: durante loading/success/error se oculta
  const showText = status === 'idle';

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (status === 'loading') {
      // Sube hasta 60%
      const target = Math.floor(blockCount * 0.6);
      intervalRef.current = setInterval(() => {
        setFilled((f) => {
          if (f >= target) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return f;
          }
          return f + 1;
        });
      }, Math.max(25, loadingDuration / target));
    }

    if (status === 'success') {
      // Salta a 100%
      setFilled(blockCount);
    }

    if (status === 'error') {
      // Retrocede a 50%
      const target = Math.floor(blockCount * 0.5);
      setFilled(target);
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

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.button,
        {
          borderColor: variant === 'primary' ? 'transparent' : theme.border,
          backgroundColor: baseBg,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          minHeight: s.minHeight,
          opacity: isDisabled && status === 'idle' ? 0.5 : 1,
        },
        style,
      ]}
    >
      {/* Bloques grandes que ocupan TODO el botón */}
      {filled > 0 && (
        <View style={styles.blocksRow} pointerEvents="none">
          {Array.from({ length: blockCount }).map((_, i) => {
            const on = i < filled;
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: '100%',
                  marginHorizontal: 1,
                  backgroundColor: on ? blockColor : 'rgba(0,0,0,0.08)',
                }}
              />
            );
          })}
        </View>
      )}

      {/* Texto encima (solo visible en idle) */}
      {showText && (
        <Text
          style={[
            styles.text,
            { color: baseTextColor, fontSize: s.fontSize },
          ]}
          numberOfLines={1}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  text: {
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  blocksRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
