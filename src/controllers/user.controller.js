const User = require('../models/user.model');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// NUEVO: Actualizar Usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    await User.updateUserRole(id, role);
    res.json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// NUEVO: Eliminar Usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.deleteUser(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};