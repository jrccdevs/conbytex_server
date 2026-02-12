const { Router } = require("express");
const router = Router();
const materialController = require("../controllers/material.controller");
const auth = require("../middlewares/auth.middleware");

const permission = require("../middlewares/permission.middleware");
// Rutas públicas
router.get(
    "/", 
    auth,
    permission("material.view"),
    materialController.getMaterials);


router.get(
    "/:id", 
    auth,
    permission("material.view"),
    materialController.getMaterialById);

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("material.create"),
    materialController.createMaterial);

router.put(
    "/:id", 
    auth, 
    permission("material.edit"),
    materialController.updateMaterial);


router.delete(
    "/:id", 
    auth, 
    permission("material.delete"),
    materialController.deleteMaterial);

module.exports = router;
