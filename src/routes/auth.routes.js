const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
module.exports = router;
