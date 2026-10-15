// ============================================================
// ServerStatusDot.tsx — Indicador de señal del servidor
// Verde: OK (<500ms) · Amarillo: lento (500-2000ms) · Rojo: caído
// ============================================================
import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Health = 'ok' | 'slow' | 'down';

const STORAGE_KEY = '@idkfree_backend_url';
const DEFAULT_BASE = 'http://127.0.0.1:3000/api';

interface Props {
  size?: number;
  pollMs?: number;
  thresholds?: { ok: number; slow: number };
}

export function ServerStatusDot({
  size = 6,
  pollMs = 10000,
  thresholds = { ok: 500, slow: 2000 },
}: Props) {
  const [status, setStatus] = useState<Health>('ok');
  const intervalRef = useRef<any>(null);

  async function ping() {
    const t0 = Date.now();
    try {
      const baseUrl = (await AsyncStorage.getItem(STORAGE_KEY)) ?? DEFAULT_BASE;
      const healthUrl = baseUrl.replace(/\/api\/?$/, '/health');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeout);
      const dt = Date.now() - t0;
      if (!res.ok) setStatus('down');
      else if (dt < thresholds.ok) setStatus('ok');
      else if (dt < thresholds.slow) setStatus('slow');
      else setStatus('down');
    } catch {
      setStatus('down');
    }
  }

  useEffect(() => {
    ping();
    intervalRef.current = setInterval(ping, pollMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const color =
    status === 'ok' ? '#22C55E' :
    status === 'slow' ? '#EAB308' :
    '#EF4444';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        shadowColor: color,
        shadowOpacity: 0.9,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      }}
    />
  );
}
