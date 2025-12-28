const { Router } = require("express");
const router = Router();
const movimientoController = require("../controllers/movimiento.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas protegidas por permisos
router.get("/", auth, checkPermission("movimientos", "view"), movimientoController.getMovimientos);
router.get("/:id", auth, checkPermission("movimientos", "view"), movimientoController.getMovimientoById);

router.post("/", auth, checkPermission("movimientos", "create"), movimientoController.createMovimiento);
router.put("/:id", auth, checkPermission("movimientos", "edit"), movimientoController.updateMovimiento);
router.delete("/:id", auth, checkPermission("movimientos", "delete"), movimientoController.deleteMovimiento);

module.exports = router;
