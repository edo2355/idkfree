// ============================================================
// migrate.ts — Migraciones multi-engine (SQLite/Turso/Postgres)
// Usa el facade async (query/exec) en lugar de db.prepare sync
// ============================================================
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { query, exec, getDBStatus } from './pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const status = await getDBStatus();
  console.log(`\n🔧 Migrando en motor: ${status.engine.toUpperCase()}`);

  const dir = join(__dirname, 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  // Crear tabla de control
  await exec(`CREATE TABLE IF NOT EXISTS migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  let applied = 0;
  let skipped = 0;

  for (const file of files) {
    const existing = await query('SELECT 1 FROM migrations WHERE name = $1', [file]);
    if (existing.rows.length > 0) {
      console.log(`  ✓ Ya aplicada: ${file}`);
      skipped++;
      continue;
    }

    console.log(`  → Aplicando: ${file}...`);
    const sql = readFileSync(join(dir, file), 'utf-8');

    try {
      await exec('BEGIN');
      await exec(sql);
      await query('INSERT INTO migrations (name) VALUES ($1)', [file]);
      await exec('COMMIT');
      console.log(`  ✓ Aplicada: ${file}`);
      applied++;
    } catch (err) {
      await exec('ROLLBACK');
      console.error(`  ✗ Error en ${file}:`, err);
      process.exit(1);
    }
  }

  console.log(`\n✅ Migraciones completadas.`);
  console.log(`   Aplicadas: ${applied} · Ya existían: ${skipped}`);
  console.log(`   Motor: ${status.engine}\n`);
}

migrate().catch((err) => {
  console.error('Fatal en migraciones:', err);
  process.exit(1);
});
