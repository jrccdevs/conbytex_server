const { Router } = require("express");
const router = Router();
const unidadController = require("../controllers/unidad.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");
// Rutas públicas
router.get(
    "/", 
    auth,
    permission("unidad.view"),
    unidadController.getUnidades);
router.get(
    "/:id", 
    auth,
    permission("unidad.view"),
    unidadController.getUnidadById);

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("unidad.create"),
    unidadController.createUnidad);

router.put(
    "/:id", 
    auth, 
    permission("unidad.edit"),
    unidadController.updateUnidad);

router.delete(
    "/:id", 
    auth, 
    permission("unidad.delete"),
    unidadController.deleteUnidad);

module.exports = router;
