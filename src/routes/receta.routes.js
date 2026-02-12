const { Router } = require("express");
const router = Router();
const recetaController = require("../controllers/receta.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// Rutas públicas
router.get(
    "/", 
    auth,
    permission("recetas.view"),
    recetaController.getRecetas);

router.get(
    "/:id", 
    auth,
    permission("recetas.view"),
    recetaController.getRecetaById);

router.get(
    "/producto/:id_producto", 
    auth,
    permission("recetas.view"),
    recetaController.getRecetasByProducto); // NUEVA RUTA

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("recetas.create"),
    recetaController.createReceta);

router.put(
    "/:id", 
    auth, 
    permission("recetas.edit"),
    recetaController.updateReceta);

router.delete(
    "/:id", 
    auth, 
    permission("recetas.delete"),
    recetaController.deleteReceta);

router.get(
    "/completa/:id_producto", 
    auth,
    permission("recetas.completada"),
    recetaController.getRecetaCompleta);


module.exports = router;
