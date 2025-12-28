const { Router } = require("express");
const router = Router();
const consumoController = require("../controllers/orden_consumo.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas protegidas por permisos
router.get("/", auth, checkPermission("orden_consumo", "view"), consumoController.getOrdenesConsumo);
router.get("/:id", auth, checkPermission("orden_consumo", "view"), consumoController.getOrdenConsumoById);

router.post("/", auth, checkPermission("orden_consumo", "create"), consumoController.createOrdenConsumo);
router.put("/:id", auth, checkPermission("orden_consumo", "edit"), consumoController.updateOrdenConsumo);
router.delete("/:id", auth, checkPermission("orden_consumo", "delete"), consumoController.deleteOrdenConsumo);

module.exports = router;
