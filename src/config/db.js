
// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_conbytex',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // opcional: ajusta el timezone si lo necesitas
  // timezone: 'Z'
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ Conexión a MySQL OK');
  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    // No detengas el proceso automáticamente; solo informa.
  }
}

// Ejecutar prueba sólo si este archivo se ejecuta directamente (útil para debug)
if (require.main === module) {
  testConnection();
}
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
module.exports = pool;

