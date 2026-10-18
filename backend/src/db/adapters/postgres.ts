// ============================================================
// postgres.ts — Adapter PostgreSQL (stub preparado)
// Cuando quieras activar:
//   1. npm install pg @types/pg
//   2. Descomentar el código comentado abajo
//   3. DB_ENGINE=postgres + DATABASE_URL=postgres://...
// ============================================================
import { randomUUID } from 'crypto';
import type { DBAdapter, DBClient, QueryResult } from './types.js';

const NOT_IMPLEMENTED = 'PostgresAdapter no está activo. Instalá "pg" y descomentá el código en adapters/postgres.ts';

export const postgresAdapter: DBAdapter = {
  engine: 'postgres' as any,
  async query<T = any>(_text: string, _params?: any[]): Promise<QueryResult<T>> {
    throw new Error(NOT_IMPLEMENTED);
  },
  async exec(_sql: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  },
  async connect(): Promise<DBClient> {
    throw new Error(NOT_IMPLEMENTED);
  },
  async end(): Promise<void> {
    // noop
  },
  uuid() { return randomUUID(); },
};

// ============================================================
// IMPLEMENTACIÓN REAL (descomentar cuando se active):
// ============================================================
// import pg from 'pg';
// const { Pool } = pg;
// let _pool: pg.Pool | null = null;
//
// function getPool() {
//   if (_pool) return _pool;
//   const url = process.env.DATABASE_URL;
//   if (!url) throw new Error('DATABASE_URL no configurada');
//   _pool = new Pool({ connectionString: url, max: 10 });
//   return _pool;
// }
//
// export const postgresAdapter: DBAdapter = {
//   engine: 'postgres',
//   async query<T = any>(text, params) {
//     const res = await getPool().query(text, params);
//     return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 };
//   },
//   async exec(sql) { await getPool().query(sql); },
//   async connect() {
//     const client = await getPool().connect();
//     return {
//       async query<T = any>(text, params) {
//         const res = await client.query(text, params);
//         return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 };
//       },
//       release() { client.release(); },
//     };
//   },
//   async end() { if (_pool) { await _pool.end(); _pool = null; } },
//   uuid() { return randomUUID(); },
// };
