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

// Obtener usuarios
exports.getAllUsers = async () => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, created_at FROM users'
  );
  return rows;
};

// NUEVO: Actualizar Rol
exports.updateUserRole = async (id, role) => {
  const [result] = await db.query(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  );
  return result;
};

// NUEVO: Eliminar Usuario
exports.deleteUser = async (id) => {
  const [result] = await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result;
};