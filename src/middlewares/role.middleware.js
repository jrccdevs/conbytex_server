module.exports = function(allowedRoles) {
  // Convertimos a array si nos pasan un solo string, para que sea siempre iterable
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // 1. Verificar si el usuario está autenticado (ya pasó por auth.middleware)
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // 2. Verificar si el rol del usuario (que viene en el JWT) está en la lista permitida
    const hasRole = roles.includes(req.user.role);

    if (!hasRole) {
      return res.status(403).json({ 
        message: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}` 
      });
    }

    // Si tiene el rol, puede continuar
    next();
  };
};