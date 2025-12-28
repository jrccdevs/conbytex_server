const { Router } = require("express");
const router = Router();
const almacenController = require("../controllers/almacen.controller");
const auth = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/auth.middleware").checkPermission;

// Rutas públicas para lectura (si quieres que todos puedan ver, sino protegemos con view)
router.get("/", auth, checkPermission("almacenes", "view"), almacenController.getAlmacenes);
router.get("/:id", auth, checkPermission("almacenes", "view"), almacenController.getAlmacenById);

// Rutas protegidas con permisos granulares
router.post("/", auth, checkPermission("almacenes", "create"), almacenController.createAlmacen);
router.put("/:id", auth, checkPermission("almacenes", "edit"), almacenController.updateAlmacen);
router.delete("/:id", auth, checkPermission("almacenes", "delete"), almacenController.deleteAlmacen);

module.exports = router;
