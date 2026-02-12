const { Router } = require("express");
const router = Router();
const ordenController = require("../controllers/orden.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// Rutas públicas
router.get(
    "/", 
    auth,
    permission("orden.view"),
    ordenController.getOrdenes);


router.get(
    "/:id",
    auth,
    permission("orden.view"),
    ordenController.getOrdenById);

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("orden.create"),
    ordenController.createOrden);

router.put(
    "/:id", 
    auth, 
    permission("orden.edit"),
    ordenController.updateOrden);

router.delete(
    "/:id", 
    auth, 
    permission("orden.delete"),
    ordenController.deleteOrden);

module.exports = router;
