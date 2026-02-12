const db = require('../config/db');

/////////////////////////
// ROLES
/////////////////////////

// Obtener todos los roles
// Obtener todos los roles con sus IDs de permisos
exports.getAllRoles = async () => {
  const [rows] = await db.query(`
    SELECT r.id, r.name, r.slug, GROUP_CONCAT(rp.permission_id) as permission_ids
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    GROUP BY r.id
  `);
  
  return rows.map(row => ({
    ...row,
    permission_ids: row.permission_ids ? row.permission_ids.split(',').map(Number) : []
  }));
};
// Crear un rol
exports.createRole = async ({ name, slug }) => {
  const [result] = await db.query(
    'INSERT INTO roles (name, slug) VALUES (?, ?)',
    [name, slug]
  );
  return result.insertId;
};

// Actualizar un rol
exports.updateRole = async (id, { name, slug }) => {
  const [result] = await db.query(
    'UPDATE roles SET name = ?, slug = ? WHERE id = ?',
    [name, slug, id]
  );
  return result;
};

// Eliminar un rol
exports.deleteRole = async (id) => {
  const [result] = await db.query(
    'DELETE FROM roles WHERE id = ?',
    [id]
  );
  return result;
};

/////////////////////////
// PERMISOS
/////////////////////////

// Obtener todos los permisos disponibles
exports.getAllPermissions = async () => {
  const [rows] = await db.query(`
    SELECT id, name, slug
    FROM permissions
  `);
  return rows;
};

// Asignar permisos a un rol (reemplaza los existentes)
exports.assignPermissions = async (role_id, permission_ids) => {
  // Primero eliminamos permisos existentes
  await db.query('DELETE FROM role_permissions WHERE role_id = ?', [role_id]);

  if (!permission_ids || permission_ids.length === 0) return;

  // Luego insertamos los nuevos
  const values = permission_ids.map(pid => [role_id, pid]);
  await db.query(
    'INSERT INTO role_permissions (role_id, permission_id) VALUES ?',
    [values]
  );
};
