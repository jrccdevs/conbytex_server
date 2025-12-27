const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

// Listar todos
router.get('/', auth, role("admin"), userController.getUsers);

// Actualizar rol por ID
router.put('/:id', auth, role("admin"), userController.updateUser);

// Eliminar por ID
router.delete('/:id', auth, role("admin"), userController.deleteUser);

module.exports = router;