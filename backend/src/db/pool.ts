// ============================================================
// pool.ts — Facade público de la DB
// Delegación a adapters/index.ts (multi-engine + failover)
// NO exporta `db` directo (usar query/exec/uuid)
// ============================================================
import { randomUUID } from 'crypto';
import {
  queryWithFailover,
  execWithFailover,
  getAdapter,
  getFallbackAdapter,
  getDBStatus,
} from './adapters/index.js';
import type { DBClient, QueryResult } from './adapters/types.js';

export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return queryWithFailover<T>(sql, params);
}

export async function exec(sql: string): Promise<void> {
  return execWithFailover(sql);
}

export function uuid(): string {
  return randomUUID();
}

export const pool = {
  async connect(): Promise<DBClient> {
    const primary = await getAdapter();
    return primary.connect();
  },
  async end(): Promise<void> {
    const primary = await getAdapter();
    await primary.end();
    const fb = await getFallbackAdapter();
    if (fb) await fb.end();
  },
};

export { getDBStatus };

// IMPORTANTE: `db` ya NO se exporta. Usar query() o exec() siempre.
