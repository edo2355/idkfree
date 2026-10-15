import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@idkfree_backend_url';
const DEFAULT_IP = '127.0.0.1';
const PORT = '3000';

/**
 * Convierte una URL relativa (/uploads/xxx) a absoluta.
 * Si ya es absoluta (http://...), la devuelve tal cual.
 */
export async function resolveAssetUrl(relative: string | null | undefined): Promise<string | null> {
  if (!relative) return null;
  if (relative.startsWith('http://') || relative.startsWith('https://')) return relative;

  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const baseUrl = stored ?? `http://${DEFAULT_IP}:${PORT}/api`;

  // baseUrl = "http://host:3000/api" → root = "http://host:3000"
  const root = baseUrl.replace(/\/api\/?$/, '');
  return root + relative;
}

export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Si tenemos una función base existente, la usamos, o construimos sobre localhost:3000
  return `http://10.40.55.64:3000${path.startsWith('/') ? '' : '/'}${path}`;
}
