const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // aquí guardas id, email, rol u otros campos que pusiste en el token
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
