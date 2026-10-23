import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@idkfree_backend_url';
const PORT = '3000';
const DEFAULT_IP = 'idkfreegetid.dpdns.org';

export async function getBackendUrl(): Promise<string> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  return `https://${DEFAULT_IP}/api`;
}

export async function setBackendUrl(ip: string): Promise<void> {
  const clean = ip.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const url = `http://${clean}:${PORT}/api`;
  await AsyncStorage.setItem(STORAGE_KEY, url);
}
