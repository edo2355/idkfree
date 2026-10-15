import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, ApiError } from '../../shared/api/client';
import { mobileStorage } from '../utils/storage';

const STORAGE_KEY = '@idkfree_backend_url';
const PORT = '3000';
const DEFAULT_IP = '127.0.0.1';

// Lee del app.json > expo.extra.apiUrl (build-time)
// Fallback: AsyncStorage (config manual desde la app)
// Último fallback: LAN local
import Constants from 'expo-constants';

async function getBaseUrl(): Promise<string> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const fromBuild = (Constants.expoConfig?.extra as any)?.apiUrl;
  if (fromBuild) return String(fromBuild);
  return `http://${DEFAULT_IP}:${PORT}/api`;
}

export const api = createApi({ getBaseUrl, storage: mobileStorage });

export { mobileStorage as storage, ApiError };
export default api;
