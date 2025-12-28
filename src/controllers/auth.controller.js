const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getMe = async (req, res) => {
  try {
    // Usamos email del token en lugar de id
    const usuario = await User.findByEmail(req.user.email);

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Eliminar password antes de enviar
    delete usuario.password;

    console.log(usuario); // debug
    res.json({ usuario });
  } catch (error) {
    console.error('Error al verificar token con API:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // verificar email
    const userExists = await User.findByEmail(email);
    if (userExists) return res.status(400).json({ message: "El email ya está registrado" });

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.json({ message: "Usuario registrado", id: userId });
  } catch (error) {
    res.status(500).json({ message: "Error en registro", error });
  }
};
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ message: "Contraseña incorrecta" });
  
      // generar token con rol
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
  
      res.json({ message: "Login exitoso", token });
    } catch (error) {
      res.status(500).json({ message: "Error en login", error });
    }
  };