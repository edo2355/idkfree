process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ignorar problemas de SSL en Termux
require('dotenv').config();
const { createClient } = require('@tursodatabase/serverless/compat');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  const sql = process.argv[2];
  try {
    const result = await db.execute(sql);
    console.log('✅ Resultado:');
    console.table(result.rows);
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.cause) console.error('Causa:', err.cause);
  }
}
run();
