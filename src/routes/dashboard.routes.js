const { Router } = require("express");
const router = Router();

const dashboardController = require("../controllers/dashboard.controller");
const auth = require("../middlewares/auth.middleware");

// 📊 Dashboard general (accesible para todos los usuarios autenticados)
router.get(
    "/resumen",
    auth,
    dashboardController.getDashboardData
);

module.exports = router;