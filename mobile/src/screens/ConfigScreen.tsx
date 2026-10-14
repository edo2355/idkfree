import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme } from '../theme/dark';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from '../components/ScreenBackground';

interface Props {
  onClose: () => void;
}

type Mode = 'local' | 'hosting';

const STORAGE_KEY = '@idkfree_backend_url';

export function ConfigScreen({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>('local');
  const [ip, setIp] = useState('127.0.0.1');
  const [customUrl, setCustomUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function buildUrl(): string | null {
    if (mode === 'local') {
      const clean = ip.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (!clean) return null;
      return `http://${clean}:3000/api`;
    } else {
      const url = customUrl.trim().replace(/\/$/, '');
      if (!url) return null;
      return url.endsWith('/api') ? url : `${url}/api`;
    }
  }

  async function testAndSave() {
    const baseUrl = buildUrl();
    if (!baseUrl) {
      setMessage({ ok: false, text: 'Introduce una dirección válida' });
      return;
    }
    setTesting(true);
    setMessage(null);

    const healthUrl = baseUrl.replace(/\/api$/, '/health');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        await AsyncStorage.setItem(STORAGE_KEY, baseUrl);
        setMessage({ ok: true, text: '✓ Conectado correctamente' });
        setTimeout(onClose, 700);
      } else {
        setMessage({ ok: false, text: `✗ Servidor respondió ${res.status}` });
      }
    } catch (e: any) {
      const msg = e?.name === 'AbortError' ? 'Timeout (8s)' : 'No se pudo conectar';
      setMessage({ ok: false, text: `✗ ${msg}` });
    }
    setTesting(false);
  }

  return (
    <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.card}>
        <Text style={styles.title}>Servidor</Text>
        <Text style={styles.subtitle}>
          Elige cómo conectar la app con el backend
        </Text>

        {/* Tabs de modo */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === 'local' && styles.tabActive]}
            onPress={() => setMode('local')}
          >
            <Text style={[styles.tabText, mode === 'local' && styles.tabTextActive]}>
              Desarrollo local
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'hosting' && styles.tabActive]}
            onPress={() => setMode('hosting')}
          >
            <Text style={[styles.tabText, mode === 'hosting' && styles.tabTextActive]}>
              Hosting
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'local' ? (
          <>
            <Text style={styles.label}>IP DEL BACKEND</Text>
            <TextInput
              style={styles.input}
              value={ip}
              onChangeText={setIp}
              placeholder="127.0.0.1"
              placeholderTextColor={darkTheme.textSubtle}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>Puerto por defecto: 3000</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>URL DEL SERVIDOR</Text>
            <TextInput
              style={styles.input}
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="https://api.idkfree.app"
              placeholderTextColor={darkTheme.textSubtle}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text style={styles.hint}>Ejemplo: https://api.idkfree.app</Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.button, testing && { opacity: 0.6 }]}
          onPress={testAndSave}
          disabled={testing}
        >
          {testing
            ? <ActivityIndicator color="#050505" />
            : <Text style={styles.buttonText}>Probar y guardar</Text>}
        </TouchableOpacity>

        {message && (
          <Text style={[styles.message, { color: message.ok ? darkTheme.success : darkTheme.danger }]}>
            {message.text}
          </Text>
        )}

        <TouchableOpacity onPress={onClose} style={styles.cancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: darkTheme.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.displayBoldItalic,
    color: darkTheme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: darkTheme.textMuted,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: darkTheme.surfaceElevated,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: darkTheme.bg,
  },
  tabText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: darkTheme.textMuted,
  },
  tabTextActive: {
    color: darkTheme.text,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.medium,
    letterSpacing: 1.5,
    color: darkTheme.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: darkTheme.bg,
    color: darkTheme.text,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.border,
    fontFamily: fonts.regular,
    fontSize: 15,
    marginBottom: 6,
  },
  hint: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: darkTheme.textSubtle,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#050505',
    fontFamily: fonts.medium,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 13,
    fontFamily: fonts.medium,
    marginTop: 14,
    textAlign: 'center',
  },
  cancel: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: darkTheme.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
});
