const db = require('../config/db');

// 🔹 Buscar por email
exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// 🔹 Crear usuario con permisos iniciales granulares
exports.createUser = async ({ name, email, password, role }) => {
  let defaultPermissions = {};

  if (role === 'admin') {
    defaultPermissions = {
      usuarios: { view: true, create: true, edit: true, delete: true },
      inventario: { view: true, create: true, edit: true, delete: true },
      ventas: { view: true, create: true, edit: true, delete: true },
      reportes: { view: true }
    };
  } else {
    defaultPermissions = {
      usuarios: { view: false, create: false, edit: false, delete: false },
      inventario: { view: true, create: false, edit: false, delete: false },
      ventas: { view: true, create: false, edit: false, delete: false },
      reportes: { view: false }
    };
  }

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, role, JSON.stringify(defaultPermissions)]
  );

  return result.insertId;
};

// 🔹 Obtener todos los usuarios (incluye permisos)
exports.getAllUsers = async () => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, permissions, created_at FROM users'
  );
  return rows.map(user => ({
    ...user,
    permissions: JSON.parse(user.permissions || '{}')
  }));
};

// 🔹 Actualizar Rol y/o Permisos
exports.updateUserRole = async (id, role, permissions) => {
  const [result] = await db.query(
    'UPDATE users SET role = ?, permissions = ? WHERE id = ?',
    [role, JSON.stringify(permissions), id]
  );
  return result;
};

// 🔹 Eliminar usuario
exports.deleteUser = async (id) => {
  const [result] = await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result;
};

// 🔹 Obtener permisos de usuario por ID
exports.getUserPermissions = async (userId) => {
  const [rows] = await db.query('SELECT permissions FROM users WHERE id = ?', [userId]);
  if (!rows[0]) return {};

  try {
    return JSON.parse(rows[0].permissions);
  } catch {
    return {};
  }
};