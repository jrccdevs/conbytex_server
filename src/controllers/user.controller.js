const User = require('../models/user.model');

// Obtener todos los usuarios con su rol
exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    
    // Ya no necesitamos hacer JSON.parse(u.permissions) 
    // porque el modelo ya nos trae los datos limpios de la DB
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Actualizar el Rol del usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body; // Ahora recibimos el ID numérico del rol
    
    if (!role_id) {
      return res.status(400).json({ message: "El role_id es obligatorio" });
    }

    await User.updateUserRole(id, role_id);
    
    res.json({ message: "Rol de usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol", error });
  }
};

// Eliminar Usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.deleteUser(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};