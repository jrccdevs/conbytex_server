const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 🔹 Obtener usuario autenticado
 */
exports.getMe = async (req, res) => {
  try {
    const usuario = await User.findByEmail(req.user.email);

    if (!usuario)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    delete usuario.password;

    res.json({ usuario });
  } catch (error) {
    console.error('Error getMe:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

/**
 * 🔹 Registro
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    const userExists = await User.findByEmail(email);
    if (userExists)
      return res.status(400).json({ message: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.json({ message: 'Usuario registrado', id: userId });
  } catch (error) {
    res.status(500).json({ message: 'Error en registro', error });
  }
};

/**
 * 🔹 LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: 'Contraseña incorrecta' });

    // 🔥 OBTENER PERMISOS DEL USUARIO (objeto con módulos y acciones)
    const permissions = await User.getUserPermissions(user.id);

    // 🔐 TOKEN COMPLETO
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions // 👈 CLAVE
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions
      }
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ message: 'Error en login' });
  }
};
