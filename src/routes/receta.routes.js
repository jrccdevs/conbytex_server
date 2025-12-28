const { Router } = require("express");
const router = Router();
const recetaController = require("../controllers/receta.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", recetaController.getRecetas);
router.get("/:id", recetaController.getRecetaById);
router.get("/producto/:id_producto", recetaController.getRecetasByProducto); // NUEVA RUTA

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), recetaController.createReceta);
router.put("/:id", auth, role("admin"), recetaController.updateReceta);
router.delete("/:id", auth, role("admin"), recetaController.deleteReceta);

router.get("/completa/:id_producto", recetaController.getRecetaCompleta);
module.exports = router;
