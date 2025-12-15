const db = require('../config/db');

// Buscar por email
exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Crear usuario
exports.createUser = async ({ name, email, password, role }) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return result.insertId;
};

// Obtener usuarios (solo admin)
exports.getAllUsers = async () => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, created_at FROM users'
  );
  return rows;
};
