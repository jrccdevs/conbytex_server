const { Router } = require("express");
const router = Router();
const unidadController = require("../controllers/unidad.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas protegidas por permisos granulares
router.get("/", auth, checkPermission("unidades", "view"), unidadController.getUnidades);
router.get("/:id", auth, checkPermission("unidades", "view"), unidadController.getUnidadById);

router.post("/", auth, checkPermission("unidades", "create"), unidadController.createUnidad);
router.put("/:id", auth, checkPermission("unidades", "edit"), unidadController.updateUnidad);
router.delete("/:id", auth, checkPermission("unidades", "delete"), unidadController.deleteUnidad);

module.exports = router;
