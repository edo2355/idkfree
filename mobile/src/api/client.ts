import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, ApiError } from '../../shared/api/client';
import { mobileStorage } from '../utils/storage';

const STORAGE_KEY = '@idkfree_backend_url';
const PORT = '3000';
const DEFAULT_IP = '127.0.0.1';

async function getBaseUrl(): Promise<string> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ?? `http://${DEFAULT_IP}:${PORT}/api`;
}

export const api = createApi({ getBaseUrl, storage: mobileStorage });

export { mobileStorage as storage, ApiError };
export default api;
