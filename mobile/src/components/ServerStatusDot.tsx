// ============================================================
// ServerStatusDot.tsx — Indicador de estado del servidor
// LOCAL OK       → 🟢 verde fijo
// REMOTO OK      → 🔵 azul pulso lento (~2s)
// REMOTO cayendo → 🔵 azul pulso rápido (~0.4s)
// Lento          → 🟡 amarillo pulso medio (~1s)
// Buscando señal → 🔴 rojo pulso rápido
// Sin red total  → 🔴 rojo fijo
// ============================================================
import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = 'local-ok' | 'remote-ok' | 'remote-reconnecting' | 'slow' | 'searching' | 'offline';

const STORAGE_KEY = '@idkfree_backend_url';
const DEFAULT_BASE = 'http://127.0.0.1:3000/api';

interface Props {
  size?: number;
  pollMs?: number;
  thresholds?: { ok: number; slow: number };
}

function isLocalUrl(url: string): boolean {
  if (!url) return true;
  const u = url.toLowerCase();
  if (u.includes('localhost') || u.includes('127.0.0.1')) return true;
  // IP privada: 10.x, 192.168.x, 172.16-31.x
  if (/^https?:\/\/10\./.test(u)) return true;
  if (/^https?:\/\/192\.168\./.test(u)) return true;
  if (/^https?:\/\/172\.(1[6-9]|2[0-9]|3[01])\./.test(u)) return true;
  return false;
}

export function ServerStatusDot({
  size = 6,
  pollMs = 8000,
  thresholds = { ok: 500, slow: 2000 },
}: Props) {
  const [state, setState] = useState<State>('searching');
  const [url, setUrl] = useState<string>(DEFAULT_BASE);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<any>(null);
  const failCountRef = useRef(0);

  async function ping() {
    const t0 = Date.now();
    try {
      const base = (await AsyncStorage.getItem(STORAGE_KEY)) ?? DEFAULT_BASE;
      setUrl(base);

      const healthUrl = base.replace(/\/api\/?$/, '/health');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeout);
      const dt = Date.now() - t0;

      if (!res.ok) throw new Error('not-ok');
      failCountRef.current = 0;

      const local = isLocalUrl(base);
      if (dt > thresholds.slow) {
        setState('slow');
      } else if (local) {
        setState('local-ok');
      } else {
        setState('remote-ok');
      }
    } catch {
      failCountRef.current += 1;
      const base = (await AsyncStorage.getItem(STORAGE_KEY)) ?? DEFAULT_BASE;
      setUrl(base);

      // Si falla 3+ veces seguidas y es remoto → reconnecting
      // Si falla 6+ veces → offline
      if (failCountRef.current >= 6) {
        setState('offline');
      } else if (!isLocalUrl(base) && failCountRef.current >= 3) {
        setState('remote-reconnecting');
      } else {
        setState('searching');
      }
    }
  }

  // Configurar animación según estado
  useEffect(() => {
    if (pulseRef.current) {
      pulseRef.current.stop();
      pulseRef.current = null;
    }
    pulseAnim.setValue(1);

    const config: Record<State, { dur: number | null; min: number }> = {
      'local-ok':          { dur: null, min: 1 },
      'remote-ok':         { dur: 2000, min: 0.35 },
      'remote-reconnecting':{ dur: 400,  min: 0.25 },
      'slow':              { dur: 1000, min: 0.4 },
      'searching':         { dur: 500,  min: 0.3 },
      'offline':           { dur: null, min: 1 },
    };
    const cfg = config[state];

    if (cfg.dur !== null) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: cfg.min,
            duration: cfg.dur / 2,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: cfg.dur / 2,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseRef.current = anim;
      anim.start();
    }
    return () => {
      if (pulseRef.current) pulseRef.current.stop();
    };
  }, [state]);

  useEffect(() => {
    ping();
    intervalRef.current = setInterval(ping, pollMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const color =
    state === 'local-ok' ? '#22C55E' :
    state === 'remote-ok' || state === 'remote-reconnecting' ? '#3B82F6' :
    state === 'slow' ? '#EAB308' :
    '#EF4444';

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: pulseAnim,
        shadowColor: color,
        shadowOpacity: 0.9,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      }}
    />
  );
}
