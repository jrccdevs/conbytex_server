const { Router } = require("express");
const router = Router();
const materialController = require("../controllers/material.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", materialController.getMaterials);
router.get("/:id", materialController.getMaterialById);

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), materialController.createMaterial);
router.put("/:id", auth, role("admin"), materialController.updateMaterial);
router.delete("/:id", auth, role("admin"), materialController.deleteMaterial);

module.exports = router;
