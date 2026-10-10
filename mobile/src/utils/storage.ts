import * as SecureStore from 'expo-secure-store';
import type { TokenStorage } from '../../shared/api/client';

export const mobileStorage: TokenStorage = {
  async getToken() {
    try { return await SecureStore.getItemAsync('idkfree_token'); }
    catch { return null; }
  },
  async setToken(token: string) { await SecureStore.setItemAsync('idkfree_token', token); },
  async removeToken() { await SecureStore.deleteItemAsync('idkfree_token'); },
};