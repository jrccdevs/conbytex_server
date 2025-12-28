const { Router } = require("express");
const router = Router();
const materialController = require("../controllers/material.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas públicas (solo lectura)
router.get("/", auth, checkPermission("materiales", "view"), materialController.getMaterials);
router.get("/:id", auth, checkPermission("materiales", "view"), materialController.getMaterialById);

// Rutas protegidas solo usuarios con permisos
router.post("/", auth, checkPermission("materiales", "create"), materialController.createMaterial);
router.put("/:id", auth, checkPermission("materiales", "edit"), materialController.updateMaterial);
router.delete("/:id", auth, checkPermission("materiales", "delete"), materialController.deleteMaterial);

module.exports = router;
