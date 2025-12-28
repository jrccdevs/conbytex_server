const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

// Listar todos los usuarios → permiso granular 'usuarios', acción 'view'
router.get('/', auth, checkPermission('usuarios', 'view'), userController.getUsers);

// Crear usuario → permiso granular 'usuarios', acción 'create'
router.post('/', auth, checkPermission('usuarios', 'create'), userController.createUser);

// Actualizar rol y permisos por ID → acción 'edit'
router.put('/:id', auth, checkPermission('usuarios', 'edit'), userController.updateUser);

// Eliminar usuario por ID → acción 'delete'
router.delete('/:id', auth, checkPermission('usuarios', 'delete'), userController.deleteUser);

module.exports = router;
