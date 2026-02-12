const { Router } = require("express");
const router = Router();
const consumoController = require("../controllers/orden_consumo.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// Rutas públicas
router.get(
    "/", 
    auth,
    permission("ordenconsumo.view"),
    consumoController.getOrdenesConsumo);

router.get(
    "/:id",
    auth, 
    permission("ordenconsumo.view"),
    consumoController.getOrdenConsumoById);

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("ordenconsumo.create"),
    consumoController.createOrdenConsumo);


router.put(
    "/:id", 
    auth, 
    permission("ordenconsumo.edit"),
    consumoController.updateOrdenConsumo);

router.delete(
    "/:id", 
    auth, 
    permission("ordenconsumo.delete"),
    consumoController.deleteOrdenConsumo);

module.exports = router;


