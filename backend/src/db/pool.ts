import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'crypto';

const db = new DatabaseSync('aldea.db');
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

/**
 * Traduce placeholders PostgreSQL ($1, $2) a SQLite (?)
 * y expande el array de params para manejar $1 repetido.
 */
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
): Promise<{ rows: T[]; rowCount: number }> {
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

class SQLiteClient {
  private inTransaction = false;

  async query<T = any>(text: string, params?: any[]) {
    const { sql, params: expanded } = translate(text, params);
    const trimmed = sql.trim().toUpperCase();

    if (trimmed === 'BEGIN') { db.exec('BEGIN'); this.inTransaction = true; return { rows: [], rowCount: 0 }; }
    if (trimmed === 'COMMIT') { db.exec('COMMIT'); this.inTransaction = false; return { rows: [], rowCount: 0 }; }
    if (trimmed === 'ROLLBACK') { db.exec('ROLLBACK'); this.inTransaction = false; return { rows: [], rowCount: 0 }; }

    const stmt = db.prepare(sql);
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH') || trimmed.includes('RETURNING')) {
      const rows = stmt.all(...expanded) as T[];
      return { rows, rowCount: rows.length };
    }
    const info = stmt.run(...expanded);
    return { rows: [], rowCount: Number(info.changes) };
  }

  release() {}
}

export function uuid(): string {
  return randomUUID();
}

export const pool = {
  query,
  async connect() { return new SQLiteClient(); },
  async end() { db.close(); },
};

export default db;
