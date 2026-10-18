// ============================================================
// index.ts — Facade de adapters con failover (tipo cohete espacial)
// Elige el motor por DB_ENGINE. Si falla N veces, cae al fallback.
// ============================================================
import type { DBAdapter, QueryResult } from './types.js';

const MAX_FAILS = 3;

let _primary: DBAdapter | null = null;
let _fallback: DBAdapter | null | undefined = undefined;  // undefined = no cargado aún
let _failCount = 0;
let _fallbackActive = false;

async function loadAdapter(engine: string): Promise<DBAdapter> {
  switch (engine) {
    case 'sqlite':   return (await import('./sqlite.js')).sqliteAdapter;
    case 'turso':    return (await import('./turso.js')).tursoAdapter;
    case 'postgres': return (await import('./postgres.js')).postgresAdapter;
    default: throw new Error(`DB_ENGINE inválido: ${engine}`);
  }
}

export async function getAdapter(): Promise<DBAdapter> {
  if (_primary) return _primary;
  const engine = process.env.DB_ENGINE ?? 'sqlite';
  _primary = await loadAdapter(engine);
  return _primary;
}

export async function getFallbackAdapter(): Promise<DBAdapter | null> {
  if (_fallback !== undefined) return _fallback;
  const fb = process.env.DB_FALLBACK ?? 'none';
  if (fb === 'none' || !fb) { _fallback = null; return null; }
  try {
    _fallback = await loadAdapter(fb);
    return _fallback;
  } catch {
    _fallback = null;
    return null;
  }
}

export async function queryWithFailover<T = any>(
  sql: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const primary = await getAdapter();
  try {
    const result = await primary.query<T>(sql, params);
    _failCount = 0;
    if (_fallbackActive) {
      console.log('[DB] Primary recuperado, desactivando fallback');
      _fallbackActive = false;
    }
    return result;
  } catch (err) {
    _failCount++;
    const fb = await getFallbackAdapter();
    if (fb && _failCount >= MAX_FAILS) {
      if (!_fallbackActive) {
        console.warn(`[DB] Primary falló ${_failCount}x → activando fallback`);
        _fallbackActive = true;
      }
      return fb.query<T>(sql, params);
    }
    throw err;
  }
}

export async function execWithFailover(sql: string): Promise<void> {
  const primary = await getAdapter();
  try {
    await primary.exec(sql);
    _failCount = 0;
  } catch (err) {
    _failCount++;
    const fb = await getFallbackAdapter();
    if (fb && _failCount >= MAX_FAILS) {
      if (!_fallbackActive) {
        console.warn(`[DB] Primary falló ${_failCount}x → activando fallback (exec)`);
        _fallbackActive = true;
      }
      await fb.exec(sql);
      return;
    }
    throw err;
  }
}

export async function getDBStatus() {
  const engine = process.env.DB_ENGINE ?? 'sqlite';
  const fallback = process.env.DB_FALLBACK ?? 'none';
  let status: 'connected' | 'fallback-active' | 'disconnected' = 'disconnected';
  let latency = 0;

  try {
    const t0 = Date.now();
    await getAdapter().then(a => a.query('SELECT 1'));
    latency = Date.now() - t0;
    status = _fallbackActive ? 'fallback-active' : 'connected';
  } catch {
    status = _fallbackActive ? 'fallback-active' : 'disconnected';
  }

  return {
    engine,
    fallback,
    status,
    fallback_active: _fallbackActive,
    fail_count: _failCount,
    latency_ms: latency,
  };
}
