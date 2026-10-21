// ============================================================
// IDKButton.tsx — Bloques rayados estilo OSHIMA
// Loading: bloques rayados llenan izq→der hasta 60%
// OK: siguen a 100% verde, espera, avisa onComplete(true)
// Error: se vuelven rojos a 50%, espera, onComplete(false)
// ============================================================
import React, { useState, useRef } from 'react';
import {
  TouchableOpacity, Text, ViewStyle, StyleSheet, View,
} from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  onPress: () => Promise<boolean | void> | boolean | void;
  onComplete?: (success: boolean) => void;
  children: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  blockCount?: number;
  loadingDuration?: number;
  successColor?: string;
  errorColor?: string;
}

const SUCCESS_DEFAULT = '#22C55E';
const ERROR_DEFAULT = '#EF4444';

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function IDKButton({
  onPress,
  onComplete,
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  blockCount = 20,
  loadingDuration = 900,
  successColor = SUCCESS_DEFAULT,
  errorColor = ERROR_DEFAULT,
}: Props) {
  const theme = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const [filled, setFilled] = useState(0);
  const busyRef = useRef(false);

  const sizes = {
    sm: { paddingVertical: 10, paddingHorizontal: 14, fontSize: 12, minHeight: 44 },
    md: { paddingVertical: 14, paddingHorizontal: 18, fontSize: 13, minHeight: 52 },
    lg: { paddingVertical: 18, paddingHorizontal: 20, fontSize: 14, minHeight: 60 },
  };
  const s = sizes[size];
  const isDisabled = disabled || status !== 'idle';

  const baseBg = variant === 'primary' ? '#FFFFFF' : 'transparent';
  const baseTextColor =
    variant === 'primary' ? '#050505' :
    variant === 'danger' ? theme.danger :
    theme.text;

  const blockColor =
    status === 'success' ? successColor :
    status === 'error' ? errorColor :
    variant === 'primary' ? '#050505' :
    variant === 'danger' ? theme.danger :
    (theme.accent ?? '#FFFFFF');

  async function animateFill(from: number, to: number, duration: number): Promise<void> {
    const steps = Math.abs(to - from);
    if (steps === 0) return;
    const stepDuration = Math.max(15, duration / steps);
    let current = from;
    const inc = from < to ? 1 : -1;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        current += inc;
        setFilled(current);
        if (current === to) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  }

  async function handlePress() {
    if (busyRef.current) return;
    busyRef.current = true;

    setStatus('loading');
    setFilled(0);

    const target60 = Math.floor(blockCount * 0.6);
    // Arranca animación (sin await todavía)
    const fillPromise = animateFill(0, target60, loadingDuration);

    let ok = false;
    try {
      const result = await onPress();
      ok = result !== false;
    } catch {
      ok = false;
    }

    // Espera a que la animación alcance 60%
    await fillPromise;

    if (ok) {
      setStatus('success');
      await animateFill(target60, blockCount, 400);
      // Mantener verde un momento
      await sleep(700);
      busyRef.current = false;
      onComplete?.(true);
      setStatus('idle');
      setFilled(0);
    } else {
      setStatus('error');
      setFilled(Math.floor(blockCount * 0.5));
      await sleep(1300);
      busyRef.current = false;
      onComplete?.(false);
      setStatus('idle');
      setFilled(0);
    }
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
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {filled > 0 && (
        <View style={styles.blocksRow} pointerEvents="none">
          {Array.from({ length: blockCount }).map((_, i) => {
            const on = i < filled;
            return (
              <View key={i} style={styles.blockWrap}>
                <Svg width="100%" height="100%" viewBox="0 0 10 30" preserveAspectRatio="none">
                  <Rect
                    x="0" y="0" width="10" height="30"
                    fill={on ? blockColor : 'rgba(0,0,0,0.06)'}
                  />
                  <Line x1="-5" y1="30" x2="5" y2="0"
                    stroke={on ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.04)'}
                    strokeWidth="1.4" />
                  <Line x1="0" y1="30" x2="10" y2="0"
                    stroke={on ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.04)'}
                    strokeWidth="1.4" />
                  <Line x1="5" y1="30" x2="15" y2="0"
                    stroke={on ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.04)'}
                    strokeWidth="1.4" />
                </Svg>
              </View>
            );
          })}
        </View>
      )}

      {status === 'idle' && (
        <Text
          style={[styles.text, { color: baseTextColor, fontSize: s.fontSize }]}
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
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  blockWrap: {
    flex: 1,
    marginHorizontal: 0.5,
  },
});
