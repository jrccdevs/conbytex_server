// middlewares/protectAdmin.middleware.js
module.exports = async (req, res, next) => {
    const { targetUserId } = req.body; // o req.params.id según la ruta
    const User = require('../models/user.model');

    // Obtener roles del usuario objetivo
    const rolesTarget = await User.getUserRoles(targetUserId);

    // Si el usuario objetivo tiene rol admin
    if (rolesTarget.some(r => r.slug === 'admin')) {
        return res.status(403).json({
            message: "No puedes modificar un usuario Admin"
        });
    }

    next();
};
