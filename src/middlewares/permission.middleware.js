const db = require('../config/db');

/**
 * Middleware para verificar permisos por slug
 * Soporta:
 *  - Permisos por rol
 *  - Permisos directos al usuario
 */
module.exports = function (requiredPermission) {
  return async (req, res, next) => {
    try {
      // 1️⃣ Verificar autenticación
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'No autenticado' });
      }

      const userId = req.user.id;

      // 2️⃣ Verificar permiso (ROL o DIRECTO)
      const [rows] = await db.query(
        `
        SELECT 1
        FROM permissions p
        WHERE p.slug = ?
        AND (
          EXISTS (
            SELECT 1
            FROM user_roles ur
            INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
            WHERE ur.user_id = ? AND rp.permission_id = p.id
          )
          OR
          EXISTS (
            SELECT 1
            FROM user_permissions up
            WHERE up.user_id = ? AND up.permission_id = p.id
          )
        )
        LIMIT 1
        `,
        [requiredPermission, userId, userId]
      );

      // 3️⃣ Si no tiene permiso → 403
      if (rows.length === 0) {
        return res.status(403).json({
          message: `No tienes el permiso requerido: ${requiredPermission}`
        });
      }

      // 4️⃣ Permiso OK
      next();

    } catch (error) {
      console.error('PERMISSION MIDDLEWARE ERROR:', error);
      res.status(500).json({ message: 'Error al verificar permisos' });
    }
  };
};
