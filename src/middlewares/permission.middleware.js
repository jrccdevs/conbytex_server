const db = require('../config/db');

module.exports = function(requiredPermission) {
  return async (req, res, next) => {
    try {
      // 1. Verificar que el usuario esté autenticado
      if (!req.user || !req.user.role_id) {
        return res.status(401).json({ message: "No autenticado o rol no identificado" });
      }

      // 2. Consultar si el rol del usuario tiene el permiso solicitado
      // Buscamos el slug del permiso en la tabla intermedia role_permissions
      const [rows] = await db.query(`
        SELECT p.slug 
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = ? AND p.slug = ?
      `, [req.user.role_id, requiredPermission]);

      // 3. Si no se encuentra el registro, el usuario no tiene ese permiso
      if (rows.length === 0) {
        return res.status(403).json({ 
          message: `No tienes el permiso necesario: [${requiredPermission}]` 
        });
      }

      // 4. Todo bien, puede pasar
      next();
    } catch (error) {
      console.error("Error en permission.middleware:", error);
      res.status(500).json({ message: "Error interno al verificar permisos" });
    }
  };
};