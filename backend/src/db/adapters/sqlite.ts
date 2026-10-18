// ============================================================
// sqlite.ts — Adapter SQLite local (node:sqlite, síncrono envuelto)
// ============================================================
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'crypto';
import type { DBAdapter, DBClient, QueryResult } from './types.js';

const db = new DatabaseSync('aldea.db');
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

function translate(sql: string, params: any[] = []): { sql: string; params: any[] } {
  const newParams: any[] = [];
  const newSql = sql.replace(/\$(\d+)/g, (_, n) => {
    const idx = parseInt(n, 10) - 1;
    newParams.push(params[idx]);
    return '?';
  });
  return { sql: newSql, params: newParams };
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const { sql, params: expanded } = translate(text, params);
  const trimmed = sql.trim().toUpperCase();
  const stmt = db.prepare(sql);

  if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH') || trimmed.startsWith('PRAGMA')) {
    const rows = stmt.all(...expanded) as T[];
    return { rows, rowCount: rows.length };
  }
  if (trimmed.includes('RETURNING')) {
    const rows = stmt.all(...expanded) as T[];
    return { rows, rowCount: rows.length };
  }
  const info = stmt.run(...expanded);
  return { rows: [], rowCount: Number(info.changes) };
}

class SQLiteClient implements DBClient {
  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    return query<T>(text, params);
  }
  release() {}
}

export const sqliteAdapter: DBAdapter = {
  engine: 'sqlite',
  query,
  async exec(sql: string) {
    db.exec(sql);
  },
  async connect() { return new SQLiteClient(); },
  async end() { db.close(); },
  uuid() { return randomUUID(); },
};
