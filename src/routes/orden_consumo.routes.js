const { Router } = require("express");
const router = Router();
const consumoController = require("../controllers/orden_consumo.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", consumoController.getOrdenesConsumo);
router.get("/:id", consumoController.getOrdenConsumoById);

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), consumoController.createOrdenConsumo);
router.put("/:id", auth, role("admin"), consumoController.updateOrdenConsumo);
router.delete("/:id", auth, role("admin"), consumoController.deleteOrdenConsumo);

module.exports = router;
