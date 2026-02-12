const db = require('../config/db');

/**
 * Obtener todos los usuarios con sus roles y permisos
 */
exports.getAllUsers = async () => {
  const [rows] = await db.query(`
    SELECT 
      u.id, u.name, u.email, u.status,
      r.id AS role_id,
      r.name AS role_name,
      -- Agrupamos permisos del ROL y permisos DIRECTOS
      (
        SELECT GROUP_CONCAT(p.slug)
        FROM permissions p
        LEFT JOIN role_permissions rp ON rp.permission_id = p.id
        WHERE rp.role_id = r.id
      ) AS role_permissions,
      (
        SELECT GROUP_CONCAT(p.slug)
        FROM permissions p
        LEFT JOIN user_permissions up ON up.permission_id = p.id
        WHERE up.user_id = u.id
      ) AS direct_permissions
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    GROUP BY u.id
  `);

  return rows.map(u => ({
    ...u,
    roles: u.role_name ? [u.role_name] : [],
    // Fusionamos ambos tipos de permisos para que la tabla muestre el total
    permissions: [
      ...(u.role_permissions ? u.role_permissions.split(',') : []),
      ...(u.direct_permissions ? u.direct_permissions.split(',') : [])
    ]
  }));
};

/**
 * Buscar usuario por ID
 */
exports.findById = async (id) => {
  const [rows] = await db.query(`
    SELECT id, name, email, status, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `, [id]);

  return rows[0];
};

/**
 * Buscar usuario por email
 */
exports.findByEmail = async (email) => {
  const [rows] = await db.query(`
    SELECT id, name, email, password, status
    FROM users
    WHERE email = ?
    LIMIT 1
  `, [email]);

  return rows[0];
};

/**
 * Obtener roles de un usuario
 */
exports.getUserRoles = async (userId) => {
  const [rows] = await db.query(`
    SELECT r.id, r.name, r.slug
    FROM roles r
    INNER JOIN user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = ?
  `, [userId]);

  return rows;
};

/**
 * Obtener permisos de un usuario
 */
exports.getUserPermissions = async (userId) => {
  const [rows] = await db.query(`
    -- Permisos que vienen por sus Roles
    SELECT DISTINCT p.id, p.slug, 'role' as origin
    FROM permissions p
    INNER JOIN role_permissions rp ON rp.permission_id = p.id
    INNER JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = ?
    
    UNION
    
    -- Permisos que le fueron asignados directamente al usuario
    SELECT p.id, p.slug, 'direct' as origin
    FROM permissions p
    INNER JOIN user_permissions up ON up.permission_id = p.id
    WHERE up.user_id = ?
  `, [userId, userId]);

  return rows; // Ahora devuelve objetos con id, slug y origen
};
/**
 * Crear usuario
 */
exports.createUser = async ({ name, email, password }) => {
  const [result] = await db.query(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, password]
  );
  return result.insertId;
};

/**
 * Asignar roles a usuario
 */
exports.assignRoles = async (userId, roleIds) => {
  const values = roleIds.map(roleId => [userId, roleId]);
  await db.query(`INSERT INTO user_roles (user_id, role_id) VALUES ?`, [values]);
};

/**
 * Remover roles de usuario
 */
exports.removeRoles = async (userId) => {
  await db.query(`DELETE FROM user_roles WHERE user_id = ?`, [userId]);
};

/**
 * Eliminar usuario
 */
exports.deleteUser = async (userId) => {
  await db.query(`DELETE FROM users WHERE id = ?`, [userId]);
};


/**
 * Obtener SOLO los permisos directos (para el formulario de edición)
 */
exports.getDirectPermissions = async (userId) => {
  const [rows] = await db.query(
    `SELECT permission_id FROM user_permissions WHERE user_id = ?`,
    [userId]
  );
  return rows.map(r => r.permission_id);
};

/**
 * Asignar permisos directos (Limpiar y Reasignar)
 */
exports.assignDirectPermissions = async (userId, permissionIds) => {
  // 1. Limpiamos permisos directos previos
  await db.query(`DELETE FROM user_permissions WHERE user_id = ?`, [userId]);

  if (!permissionIds || permissionIds.length === 0) return;

  // 2. Insertamos los nuevos "extras"
  const values = permissionIds.map(pId => [userId, pId]);
  await db.query(
    `INSERT INTO user_permissions (user_id, permission_id) VALUES ?`,
    [values]
  );
};