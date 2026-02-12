const { Router } = require('express');
const router = Router();
const rolesController = require('../controllers/role.controller');

// Middlewares
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const checkPermission = require('../middlewares/permission.middleware');
const protectAdmin = require('../middlewares/protectAdmin.middleware');

/**
 * RUTAS DE ROLES Y PERMISOS
 * Solo accesibles por Admin
 */

// Listar roles
router.get(
  '/',
  auth,
  checkPermission('roles.view'),
  rolesController.getRoles
);

// Listar permisos
router.get(
  '/permissions',
  auth,
  checkPermission('roles.view'),
  rolesController.getPermissionsList
);

// Crear rol
router.post(
  '/',
  auth,             // primero validamos token
  role('admin'),     // luego validamos que sea admin
  checkPermission('roles.create'), // finalmente validamos el permiso
  rolesController.createRole
);


// Actualizar rol
router.put(
  '/:id',
  auth,
  checkPermission('roles.edit'),
  role('admin'),
  rolesController.updateRole
);

// Eliminar rol
router.delete(
  '/:id',
  auth,
  checkPermission('roles.delete'),
  role('admin'),
  rolesController.deleteRole
);

// Asignar roles a usuario
router.post(
  '/assign-to-user',
  auth,
  checkPermission('roles.assign_permissions'),
  role('admin'),
  protectAdmin,
  rolesController.assignRolesToUser
);

module.exports = router;
