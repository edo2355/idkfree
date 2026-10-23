// ============================================================
// ConnectionHUD.tsx — Terminal de estado de conexión
// Mini-HUD colapsable con info del backend en vivo
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../theme/fonts';

const STORAGE_KEY = '@idkfree_backend_url';
const DEFAULT_BASE = 'https://idkfreegetid.dpdns.org/api';

type Health = 'connected' | 'slow' | 'reconnecting' | 'offline';

interface HealthData {
  version?: string;
  db_engine?: string;
  uptime_s?: number;
  node_version?: string;
  env?: string;
}

interface Props {
  defaultExpanded?: boolean;
  pollMs?: number;
  onOpenConfig?: () => void;
}

function isLocalUrl(url: string): boolean {
  if (!url) return true;
  const u = url.toLowerCase();
  if (u.includes('localhost') || u.includes('127.0.0.1')) return true;
  if (/^https?:\/\/10\./.test(u)) return true;
  if (/^https?:\/\/192\.168\./.test(u)) return true;
  if (/^https?:\/\/172\.(1[6-9]|2[0-9]|3[01])\./.test(u)) return true;
  return false;
}

export function ConnectionHUD({
  defaultExpanded = false,
  pollMs = 8000,
  onOpenConfig,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [health, setHealth] = useState<Health>('reconnecting');
  const [data, setData] = useState<HealthData>({});
  const [latency, setLatency] = useState(0);
  const [url, setUrl] = useState(DEFAULT_BASE);
  const [lastUpdate, setLastUpdate] = useState('--:--:--');
  const [httpStatus, setHttpStatus] = useState(0);
  const [failCount, setFailCount] = useState(0);

  const animHeight = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

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

      const json = await res.json();
      setData(json);
      setLatency(dt);
      setHttpStatus(res.status);
      setLastUpdate(new Date().toTimeString().slice(0, 8));
      setFailCount(0);

      if (dt > 2000) setHealth('slow');
      else setHealth('connected');
    } catch (e) {
      setFailCount((c) => c + 1);
      setHttpStatus(0);
      setLatency(0);
      if (failCount >= 3) setHealth('offline');
      else setHealth('reconnecting');
    }
  }

  useEffect(() => {
    ping();
    const interval = setInterval(ping, pollMs);
    return () => clearInterval(interval);
  }, []);

  function toggleExpand() {
    Animated.timing(animHeight, {
      toValue: expanded ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  }

  const color =
    health === 'connected' ? '#22C55E' :
    health === 'slow' ? '#EAB308' :
    '#EF4444';

  const mode = isLocalUrl(url) ? 'LOCAL' : 'REMOTE';
  const hostname = url.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '');

  const statusLabel =
    health === 'connected' ? 'LIVE' :
    health === 'slow' ? 'SLOW' :
    health === 'reconnecting' ? 'RECONNECT' :
    'OFFLINE';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={toggleExpand}
        onLongPress={onOpenConfig}
        delayLongPress={400}
        activeOpacity={0.7}
        style={styles.collapsed}
      >
        <View style={[styles.dot, { backgroundColor: color }]} />
        <TouchableOpacity onPress={ping} activeOpacity={0.6}>
          <Text style={[styles.statusText, { color }]}>
            {statusLabel}
          </Text>
        </TouchableOpacity>
        <Text style={styles.sep}>·</Text>
        <Text style={styles.modeText}>{mode}</Text>
        <Text style={styles.sep}>·</Text>
        <Text style={styles.dbText}>{data.db_engine ?? 'sqlite'}</Text>
        {latency > 0 && (
          <>
            <Text style={styles.sep}>·</Text>
            <Text style={styles.latencyText}>{latency}ms</Text>
          </>
        )}
        <Text style={styles.chevron}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expanded}>
          <View style={styles.divider} />
          <Row label="STATUS" value={health.toUpperCase()} color={color} />
          <Row label="MODE" value={mode} />
          <Row label="ENDPOINT" value={hostname} />
          <Row label="DB ENGINE" value={(data.db_engine ?? 'sqlite').toUpperCase()} />
          <Row label="LATENCY" value={latency > 0 ? `${latency}ms` : '--'} />
          <Row label="HTTP" value={httpStatus > 0 ? `${httpStatus} OK` : '--'} />
          <Row label="VERSION" value={data.version ?? '--'} />
          <Row label="NODE" value={data.node_version ?? '--'} />
          <Row label="UPTIME" value={data.uptime_s !== undefined ? `${data.uptime_s}s` : '--'} />
          <Row label="ENV" value={(data.env ?? '--').toUpperCase()} />
          <Row label="LAST POLL" value={lastUpdate} />
          {failCount > 0 && (
            <Row label="FAIL COUNT" value={String(failCount)} color="#EF4444" />
          )}
          <View style={styles.divider} />
          {onOpenConfig && (
            <TouchableOpacity onPress={onOpenConfig} style={{ paddingVertical: 8, alignItems: 'center' }}>
              <Text style={{ color: '#A3A3A3', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1 }}>[ CAMBIAR SERVIDOR ⚙ ]</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, color ? { color } : null]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  collapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#0A0A0A',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  sep: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#333',
  },
  modeText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#A3A3A3',
    letterSpacing: 1,
  },
  dbText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#5F5F5F',
    letterSpacing: 1,
  },
  latencyText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#5F5F5F',
  },
  chevron: {
    marginLeft: 'auto',
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#5F5F5F',
  },
  expanded: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#222',
    backgroundColor: '#0A0A0A',
  },
  divider: {
    height: 1,
    backgroundColor: '#1A1A1A',
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 8,
  },
  rowLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#5F5F5F',
    letterSpacing: 1,
  },
  rowValue: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#E5E5E5',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'right',
  },
});
