const { Router } = require("express");
const router = Router();
const ordenController = require("../controllers/orden.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas protegidas por permisos
router.get("/", auth, checkPermission("orden", "view"), ordenController.getOrdenes);
router.get("/:id", auth, checkPermission("orden", "view"), ordenController.getOrdenById);

router.post("/", auth, checkPermission("orden", "create"), ordenController.createOrden);
router.put("/:id", auth, checkPermission("orden", "edit"), ordenController.updateOrden);
router.delete("/:id", auth, checkPermission("orden", "delete"), ordenController.deleteOrden);

module.exports = router;
