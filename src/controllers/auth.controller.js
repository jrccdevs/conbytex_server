const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // Ahora recibimos role_id (opcional, por defecto 2 que suele ser 'user')
    const { name, email, password, role_id = 2 } = req.body;

    const userExists = await User.findByEmail(email);
    if (userExists) return res.status(400).json({ message: "El email ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.createUser({
      name,
      email,
      password: hashedPassword,
      role_id // Enviamos el ID numérico
    });

    res.json({ message: "Usuario registrado con éxito", id: userId });
  } catch (error) {
    console.error(error);
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

    // EL CAMBIO ESTÁ AQUÍ:
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role_name,
        role_id: user.role_id // <--- Asegúrate de que esta línea exista
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({ message: "Login exitoso", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error });
  }
};

exports.getMe = async (req, res) => {
  try {
    // El middleware 'auth' ya puso los datos del token en req.user
    const usuario = await User.findByEmail(req.user.email);

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    delete usuario.password;
    
    // Devolvemos el usuario con su role_name incluido
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};