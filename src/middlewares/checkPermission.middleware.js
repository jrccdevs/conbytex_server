module.exports = function checkPermission(module, action) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // 🔥 Admin tiene acceso total
    if (req.user.role === 'admin') {
      return next();
    }

    const permissions = req.user.permissions || {};

    // Validar que el módulo exista y tenga permiso en la acción
    if (!permissions[module] || !permissions[module][action]) {
      return res.status(403).json({
        message: `No tienes permiso para ${action} en ${module}`
      });
    }

    next();
  };
};
