const { Router } = require("express");
const router = Router();
const unidadController = require("../controllers/unidad.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", unidadController.getUnidades);
router.get("/:id", unidadController.getUnidadById);

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), unidadController.createUnidad);
router.put("/:id", auth, role("admin"), unidadController.updateUnidad);
router.delete("/:id", auth, role("admin"), unidadController.deleteUnidad);

module.exports = router;
