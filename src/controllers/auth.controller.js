const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Registro de usuario
 * Recibe: name, email, password, role_id (opcional)
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role_id = null } = req.body;

    // 1. Verificar si el email ya existe
    const userExists = await User.findByEmail(email);
    if (userExists) return res.status(400).json({ message: "El email ya está registrado" });

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    const userId = await User.createUser({ name, email, password: hashedPassword });

    // 4. Asignar rol si se pasa (Admin puede pasar role_id)
    if (role_id) await User.assignRole(userId, role_id);

    res.status(201).json({ message: "Usuario registrado con éxito", id: userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en registro", error });
  }
};

/**
 * Login de usuario
 * Recibe: email, password
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Obtener roles y permisos del usuario
    const roles = await User.getUserRoles(user.id);
    const permissions = await User.getUserPermissions(user.id);

    // Usar el primer rol como "rol principal" en el JWT (puedes cambiar esto si quieres multi-roles)
    const roleSlug = roles.length > 0 ? roles[0].slug : null;

    // Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: roleSlug, // ✅ aquí va el slug
        role_id: roles.length > 0 ? roles[0].id : null
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        permissions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en login", error });
  }
};

/**
 * Obtener datos del usuario logueado
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const roles = await User.getUserRoles(user.id);
    const permissions = await User.getUserPermissions(user.id);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        permissions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

/**
 * Obtener solo permisos del usuario logueado
 */
exports.getMyPermissions = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });

    const roles = await User.getUserRoles(req.user.id);
    const permissions = await User.getUserPermissions(req.user.id);

    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        roles
      },
      permissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener permisos', error });
  }
};
