import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import db from './pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function migrate() {
  const dir = join(__dirname, 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  db.exec(`CREATE TABLE IF NOT EXISTS migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  for (const file of files) {
    const row = db.prepare('SELECT 1 FROM migrations WHERE name = ?').get(file);
    if (row) { console.log(`✓ Ya aplicada: ${file}`); continue; }
    console.log(`Aplicando: ${file}...`);
    const sql = readFileSync(join(dir, file), 'utf-8');
    try {
      db.exec('BEGIN');
      db.exec(sql);
      db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
      db.exec('COMMIT');
      console.log(`✓ Aplicada: ${file}`);
    } catch (err) {
      db.exec('ROLLBACK');
      console.error(`✗ Error en ${file}:`, err);
      process.exit(1);
    }
  }
  console.log('Migraciones completadas.');
}

migrate();
