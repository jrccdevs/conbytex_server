const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

// Middlewares
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const checkPermission = require('../middlewares/permission.middleware');

/**
 * RUTAS DE USUARIOS
 * Todas las rutas aquí requieren que el usuario esté logueado (auth)
 */

// 1. Listar todos los usuarios
// Requisito: Estar logueado Y tener el permiso 'users.view'
router.get('/', 
    auth, 
    checkPermission('users.view'), 
    userController.getUsers
);

// 2. Actualizar rol de un usuario
// Requisito: Solo Administradores pueden cambiar roles
router.put('/:id', 
    auth, 
    role('admin'), 
    userController.updateUser
);

// 3. Eliminar usuario
// Requisito: Estar logueado Y tener el permiso específico 'users.delete'
router.delete('/:id', 
    auth, 
    checkPermission('users.delete'), 
    userController.deleteUser
);

module.exports = router;