const { Router } = require("express");
const router = Router();
const colorController = require("../controllers/color.controller");
const auth = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/auth.middleware").checkPermission;

// Rutas públicas protegidas con permisos de vista
router.get("/", auth, checkPermission("colores", "view"), colorController.getColors);
router.get("/:id", auth, checkPermission("colores", "view"), colorController.getColorById);

// Rutas protegidas con permisos granulares
router.post("/", auth, checkPermission("colores", "create"), colorController.createColor);
router.put("/:id", auth, checkPermission("colores", "edit"), colorController.updateColor);
router.delete("/:id", auth, checkPermission("colores", "delete"), colorController.deleteColor);

module.exports = router;
