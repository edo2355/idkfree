import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@idkfree_backend_url';
const DEFAULT_IP = 'idkfreegetid.dpdns.org';
const PORT = '3000';

/**
 * Convierte una URL relativa (/uploads/xxx) a absoluta.
 * Si ya es absoluta (http://...), la devuelve tal cual.
 */
export async function resolveAssetUrl(relative: string | null | undefined): Promise<string | null> {
  if (!relative) return null;
  if (relative.startsWith('http://') || relative.startsWith('https://')) return relative;

  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const baseUrl = stored ?? `https://${DEFAULT_IP}/api`;

  // baseUrl = "http://host:3000/api" → root = "http://host:3000"
  const root = baseUrl.replace(/\/api\/?$/, '');
  return root + relative;
}
