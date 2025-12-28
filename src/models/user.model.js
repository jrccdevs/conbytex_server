const db = require('../config/db');

// Buscar por email
exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Crear usuario con permisos iniciales por defecto
exports.createUser = async ({ name, email, password, role }) => {
  // Definimos permisos iniciales: Admins todo, Users solo lectura de inventario
  const defaultPermissions = role === 'admin' 
    ? { usuarios: true, inventario: true, reportes: true, ventas: true } 
    : { usuarios: false, inventario: true, reportes: false, ventas: false };

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, role, JSON.stringify(defaultPermissions)]
  );
  return result.insertId;
};

// Obtener usuarios (incluimos permissions)
exports.getAllUsers = async () => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, permissions, created_at FROM users'
  );
  return rows;
};

// Actualizar Rol y/o Permisos
exports.updateUserRole = async (id, role, permissions) => {
  // Si enviamos permisos, los actualizamos; si no, solo el rol
  const [result] = await db.query(
    'UPDATE users SET role = ?, permissions = ? WHERE id = ?',
    [role, JSON.stringify(permissions), id]
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