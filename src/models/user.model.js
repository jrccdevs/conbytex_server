const db = require('../config/db');

// Buscar por email - Ahora hace JOIN para traer el nombre del rol
exports.findByEmail = async (email) => {
  const [rows] = await db.query(`
    SELECT u.*, r.name as role_name 
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
  `, [email]);
  return rows[0];
};

// Crear usuario - Ahora usa el ID del rol y no guardamos JSON de permisos
exports.createUser = async ({ name, email, password, role_id = 2 }) => { 
  // Nota: role_id = 2 asumiendo que el ID 2 es 'user' o 'editor' según tus inserts
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
    [name, email, password, role_id]
  );
  return result.insertId;
};

// Obtener todos los usuarios con su nombre de rol
exports.getAllUsers = async () => {
  const [rows] = await db.query(`
    SELECT u.id, u.name, u.email, r.name as role, u.created_at 
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
  `);
  return rows;
};

// Actualizar solo el role_id
exports.updateUserRole = async (id, role_id) => {
  const [result] = await db.query(
    'UPDATE users SET role_id = ? WHERE id = ?',
    [role_id, id]
  );
  return result;
};

// Eliminar Usuario
exports.deleteUser = async (id) => {
  const [result] = await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result;
};