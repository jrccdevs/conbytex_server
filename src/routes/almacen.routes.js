const { Router } = require("express");
const router = Router();
const almacenController = require("../controllers/almacen.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// Rutas públicas
router.get(
    "/",
    auth,
    permission("almacen.view"), 
    almacenController.getAlmacenes
    );
router.get(
    "/:id",
    auth,
    permission("almacen.view"),
    almacenController.getAlmacenById);

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("almacen.create"), 
    almacenController.createAlmacen);


router.put(
    "/:id", 
    auth, 
    permission("almacen.edit"), 
    almacenController.updateAlmacen);

router.delete(
    "/:id", 
    auth, 
    permission("almacen.delete"), 
    almacenController.deleteAlmacen);

module.exports = router;
