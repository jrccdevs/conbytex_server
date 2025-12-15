const { Router } = require("express");
const router = Router();
const colorController = require("../controllers/color.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", colorController.getColors);
router.get("/:id", colorController.getColorById);

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), colorController.createColor);
router.put("/:id", auth, role("admin"), colorController.updateColor);
router.delete("/:id", auth, role("admin"), colorController.deleteColor);

module.exports = router;
