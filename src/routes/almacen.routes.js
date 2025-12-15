const { Router } = require("express");
const router = Router();
const almacenController = require("../controllers/almacen.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", almacenController.getAlmacenes);
router.get("/:id", almacenController.getAlmacenById);

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), almacenController.createAlmacen);
router.put("/:id", auth, role("admin"), almacenController.updateAlmacen);
router.delete("/:id", auth, role("admin"), almacenController.deleteAlmacen);

module.exports = router;
