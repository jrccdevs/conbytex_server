const { Router } = require("express");
const router = Router();
const ordenController = require("../controllers/orden.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", ordenController.getOrdenes);
router.get("/:id", ordenController.getOrdenById);

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), ordenController.createOrden);
router.put("/:id", auth, role("admin"), ordenController.updateOrden);
router.delete("/:id", auth, role("admin"), ordenController.deleteOrden);

module.exports = router;
