const { Router } = require("express");
const router = Router();
const colorController = require("../controllers/color.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");
// Rutas públicas
router.get(
    "/", 
    auth,
    permission("color.view"),
    colorController.getColors);

router.get(
    "/:id",
    auth, 
    permission("color.view"),
    colorController.getColorById);

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("color.create"), 
    colorController.createColor);

router.put(
    "/:id", 
    auth, 
    permission("color.edit"),
    colorController.updateColor);

router.delete(
    "/:id", 
    auth, 
    permission("color.delete"), 
    colorController.deleteColor);

module.exports = router;
