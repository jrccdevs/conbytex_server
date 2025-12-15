const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/', auth, role("admin"), userController.getUsers);

module.exports = router;
