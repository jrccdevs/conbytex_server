const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Para obtener permisos actualizados

/**
 * Middleware de autenticación
 * Verifica token JWT y adjunta info de usuario a req.user
 */
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Obtener permisos actualizados desde la DB
    const permissions = await User.getUserPermissions(decoded.id);

    // Adjuntar info del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: permissions || {} // Objeto con módulo -> acciones
    };

    next();
  } catch (err) {
    console.error('Error en auth.middleware:', err);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
