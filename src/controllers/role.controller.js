const Role = require('../models/role.model');
const User = require('../models/user.model');

/**
 * ===============================
 * OBTENER TODOS LOS ROLES
 * ===============================
 */
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.getAllRoles();
    res.json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener roles" });
  }
};

/**
 * ===============================
 * OBTENER CATÁLOGO DE PERMISOS
 * ===============================
 */
exports.getPermissionsList = async (req, res) => {
  try {
    const permissions = await Role.getAllPermissions();
    res.json({ permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener permisos" });
  }
};

/**
 * ===============================
 * CREAR NUEVO ROL
 * ===============================
 * Seguridad:
 *  - auth
 *  - role('admin')
 *  - checkPermission('roles.create')
 */
exports.createRole = async (req, res) => {
  try {
    const { name, slug, permission_ids } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "El nombre y el slug son obligatorios"
      });
    }

    const roleId = await Role.createRole({ name, slug });

    if (permission_ids && permission_ids.length > 0) {
      await Role.assignPermissions(roleId, permission_ids);
    }

    res.status(201).json({
      message: "Rol creado correctamente",
      roleId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear rol" });
  }
};

/**
 * ===============================
 * ACTUALIZAR ROL
 * ===============================
 * Seguridad:
 *  - auth
 *  - role('admin')
 *  - checkPermission('roles.edit')
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, permission_ids } = req.body;

    // 1. Actualizar datos básicos
    await Role.updateRole(id, { name, slug });

    // 2. Sincronizar permisos (tu modelo ya borra y crea)
    // Pasamos el array aunque esté vacío para que si el usuario desmarca todo, se borren en la DB
    await Role.assignPermissions(id, permission_ids || []);

    res.json({ message: "Rol actualizado correctamente" });

  } catch (error) {
    console.error("Error en updateRole:", error);
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};

/**
 * ===============================
 * ELIMINAR ROL
 * ===============================
 * Seguridad:
 *  - auth
 *  - role('admin')
 *  - checkPermission('roles.delete')
 */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    await Role.deleteRole(id);

    res.json({ message: "Rol eliminado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar rol" });
  }
};

/**
 * ===============================
 * ASIGNAR ROLES A USUARIO
 * ===============================
 * Seguridad:
 *  - auth
 *  - role('admin')
 *  - checkPermission('roles.assign_permissions')
 */
exports.assignRolesToUser = async (req, res) => {
  try {
    const { user_id, role_ids } = req.body;

    if (!user_id || !Array.isArray(role_ids)) {
      return res.status(400).json({
        message: "user_id y role_ids son obligatorios"
      });
    }

    // 🔒 PROTECCIÓN: No modificar usuarios Admin
    const targetRoles = await User.getUserRoles(user_id);
    if (targetRoles.some(r => r.slug === 'admin')) {
      return res.status(403).json({
        message: "No puedes modificar un usuario Admin"
      });
    }

    await User.setUserRoles(user_id, role_ids);

    res.json({ message: "Roles asignados correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al asignar roles" });
  }
};
