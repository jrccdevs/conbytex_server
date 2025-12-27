const User = require('../models/user.model');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    // Parseamos los permisos de string JSON a objeto JS antes de enviar
    const usersWithParsedPermissions = users.map(u => ({
      ...u,
      permissions: typeof u.permissions === 'string' ? JSON.parse(u.permissions) : u.permissions
    }));
    res.json(usersWithParsedPermissions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Actualizar Usuario y sus Permisos granulares
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body; 
    
    // Si no vienen permisos en el body, mantenemos la lógica básica
    await User.updateUserRole(id, role, permissions);
    
    res.json({ message: "Privilegios actualizados correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar permisos", error });
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