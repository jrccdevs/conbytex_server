const { Router } = require("express");
const router = Router();
const sizeController = require("../controllers/size.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", sizeController.getSizes);
router.get("/:id", sizeController.getSizeById);

// Rutas protegidas solo para admin
router.post("/", auth, role("admin"), sizeController.createSize);
router.put("/:id", auth, role("admin"), sizeController.updateSize);
router.delete("/:id", auth, role("admin"), sizeController.deleteSize);

module.exports = router;
