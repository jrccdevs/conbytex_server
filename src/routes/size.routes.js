const { Router } = require("express");
const router = Router();
const sizeController = require("../controllers/size.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// Rutas públicas
router.get(
    "/", 
    auth,
    permission("size.view"),
    sizeController.getSizes);

router.get(
    "/:id", 
    auth,
    permission("size.view"),
    sizeController.getSizeById);

// Rutas protegidas solo para admin
router.post(
    "/", 
    auth, 
    permission("size.create"),
    sizeController.createSize);

router.put(
    "/:id", 
    auth, 
    permission("size.edit"),
    sizeController.updateSize);


router.delete(
    "/:id", 
    auth, 
    permission("size.delete"),
    sizeController.deleteSize);

module.exports = router;
