const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

// Middlewares
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const checkPermission = require('../middlewares/permission.middleware');

/**
 * RUTAS DE USUARIOS
 * Todas requieren estar autenticado (auth)
 */

// 1️⃣ Listar todos los usuarios
// Permiso requerido: 'users.view'
router.get(
  '/',
  auth,
  checkPermission('users.view'),
  userController.getUsers
);

// 2️⃣ Crear usuario
// Permiso requerido: 'users.create'
router.post(
  '/',
  auth,
  checkPermission('users.create'),
  userController.createUser
);

// 3️⃣ Actualizar roles de un usuario
// Permiso requerido: 'users.edit' (puede combinarse con role admin si quieres)
router.put(
  '/:id/roles',
  auth,
  checkPermission('users.edit'),
  userController.updateUserRoles
);

// 4️⃣ Eliminar usuario
// Permiso requerido: 'users.delete'
router.delete(
  '/:id',
  auth,
  checkPermission('users.delete'),
  userController.deleteUser
);
// En tu backend (rutas de usuario)
router.put(
  '/:id', // Ruta general para datos básicos
  auth,
  checkPermission('users.edit'),
  userController.updateUser // Un método que actualice name, email, etc.
);

// NUEVA RUTA: Para Roles y Permisos Directos
router.put(
  '/:id/security', 
  auth, 
  checkPermission('users.edit'), 
  userController.updateUserPermissions);
module.exports = router;
// Obtener usuario por ID
router.get('/:id', auth, checkPermission('users.view'), userController.getUserById);
