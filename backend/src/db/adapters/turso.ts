// ============================================================
// turso.ts — Adapter Turso (libSQL cloud, usa /web para Termux)
// Soporta transacciones vía BEGIN/COMMIT/ROLLBACK para compat
// ============================================================
import { createClient, type Client } from '@libsql/client/web';
import { randomUUID } from 'crypto';
import type { DBAdapter, DBClient, QueryResult } from './types.js';

let _client: Client | null = null;

function getClient(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL o TURSO_AUTH_TOKEN no configurados');
  }
  _client = createClient({ url, authToken });
  return _client;
}

function translate(sql: string, params: any[] = []): { sql: string; args: any[] } {
  const args: any[] = [];
  const outSql = sql.replace(/\$(\d+)/g, (_, n) => {
    const idx = parseInt(n, 10) - 1;
    args.push(params[idx]);
    return '?';
  });
  return { sql: outSql, args };
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = getClient();
  const { sql, args } = translate(text, params);
  const result = await client.execute({ sql, args });
  return { rows: result.rows as unknown as T[], rowCount: result.rowsAffected };
}

class TursoClient implements DBClient {
  private tx: any = null;

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const trimmed = text.trim().toUpperCase();

    if (trimmed === 'BEGIN') {
      this.tx = await getClient().transaction('write');
      return { rows: [], rowCount: 0 };
    }
    if (trimmed === 'COMMIT') {
      if (this.tx) { await this.tx.commit(); this.tx = null; }
      return { rows: [], rowCount: 0 };
    }
    if (trimmed === 'ROLLBACK') {
      if (this.tx) { await this.tx.rollback(); this.tx = null; }
      return { rows: [], rowCount: 0 };
    }

    const { sql, args } = translate(text, params);
    const target = this.tx ?? getClient();
    const result = await target.execute({ sql, args });
    return { rows: result.rows as unknown as T[], rowCount: result.rowsAffected };
  }

  release() {
    if (this.tx) { this.tx.rollback().catch(() => {}); this.tx = null; }
  }
}

export const tursoAdapter: DBAdapter = {
  engine: 'turso',
  query,
  async exec(sql: string) {
    const client = getClient();
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await client.execute(stmt);
    }
  },
  async connect() { return new TursoClient(); },
  async end() {
    if (_client) { _client.close(); _client = null; }
  },
  uuid() { return randomUUID(); },
};
