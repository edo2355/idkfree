// ============================================================
// types.ts — Interfaz común para adapters de DB
// Permite alternar SQLite local <-> Turso sin tocar el resto
// ============================================================
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface DBClient {
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  release(): void;
}

export interface DBAdapter {
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  exec(sql: string): Promise<void>;
  connect(): Promise<DBClient>;
  end(): Promise<void>;
  uuid(): string;
  engine: 'sqlite' | 'turso';
}
