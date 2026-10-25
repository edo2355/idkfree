import { query } from '../db/pool.js';

export async function getSetting(key: string, fallback: string): Promise<string> {
  try {
    const res = await query('SELECT value FROM app_settings WHERE key = $1', [key]);
    if (res.rows.length > 0 && res.rows[0].value) {
      return res.rows[0].value as string;
    }
  } catch (e) {
    console.warn(`⚠️ No se pudo leer ${key} de la DB. Usando fallback.`);
  }
  return fallback;
}
