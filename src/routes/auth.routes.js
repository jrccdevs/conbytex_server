const { Router } = require('express');
const router = Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * AUTH
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me-permissions', authMiddleware, authController.getMe);

module.exports = router;
