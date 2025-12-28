const { Router } = require("express");
const router = Router();
const recetaController = require("../controllers/receta.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas protegidas por permisos
router.get("/", auth, checkPermission("recetas", "view"), recetaController.getRecetas);
router.get("/:id", auth, checkPermission("recetas", "view"), recetaController.getRecetaById);
router.get("/producto/:id_producto", auth, checkPermission("recetas", "view"), recetaController.getRecetasByProducto);
router.get("/completa/:id_producto", auth, checkPermission("recetas", "view"), recetaController.getRecetaCompleta);

router.post("/", auth, checkPermission("recetas", "create"), recetaController.createReceta);
router.put("/:id", auth, checkPermission("recetas", "edit"), recetaController.updateReceta);
router.delete("/:id", auth, checkPermission("recetas", "delete"), recetaController.deleteReceta);

module.exports = router;
