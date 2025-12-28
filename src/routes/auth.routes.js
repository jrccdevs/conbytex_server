const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

// Registro y login son públicos
router.post('/register', authController.register);
router.post('/login', authController.login);

// Obtener datos del usuario autenticado
router.get('/me', auth, authController.getMe);

module.exports = router;
