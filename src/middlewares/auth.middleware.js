const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Obtener el header de autorización
  const authHeader = req.headers.authorization;

  // 2. Verificar si el header existe y tiene el formato "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: "Acceso denegado. Token no proporcionado o formato inválido" 
    });
  }

  // 3. Extraer el token del string "Bearer XXXXXX"
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verificar la validez del token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* 5. Almacenamos el contenido del token en req.user.
       Ahora req.user contendrá: 
       { id, email, role (nombre), role_id (nuevo) }
    */
    req.user = decoded;

    // 6. Continuar al siguiente middleware o controlador
    next();
  } catch (error) {
    // Manejo específico si el token expiró
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "El token ha expirado, inicia sesión nuevamente" });
    }
    
    // Cualquier otro error de validación
    return res.status(401).json({ message: "Token inválido o corrupto" });
  }
};