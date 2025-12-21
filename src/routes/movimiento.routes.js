const { Router } = require("express");
const router = Router();
const movimientoController = require("../controllers/movimiento.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas o solo lectura (para empleados y admin)
router.get("/", auth, movimientoController.getMovimientos);
router.get("/:id", auth, movimientoController.getMovimientoById);

// Rutas protegidas solo para administradores
router.post("/", auth, role("admin"), movimientoController.createMovimiento);
router.put("/:id", auth, role("admin"), movimientoController.updateMovimiento);
router.delete("/:id", auth, role("admin"), movimientoController.deleteMovimiento);

module.exports = router;