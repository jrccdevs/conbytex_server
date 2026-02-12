const { Router } = require("express");
const router = Router();
const movimientoController = require("../controllers/movimiento.controller");
const auth = require("../middlewares/auth.middleware");

const permission = require("../middlewares/permission.middleware");
// Rutas públicas o solo lectura (para empleados y admin)
router.get(
    "/", 
    auth, 
    permission("movimientos.view"),
    movimientoController.getMovimientos);


router.get(
    "/:id", 
    auth, 
    permission("movimientos.view"),
    movimientoController.getMovimientoById);

// Rutas protegidas solo para administradores
router.post(
    "/", 
    auth, 
    permission("movimientos.create"),
    movimientoController.createMovimiento);


router.put(
    "/:id", 
    auth, 
    permission("movimientos.edit"),
    movimientoController.updateMovimiento);

router.delete(
    "/:id", 
    auth, 
    permission("movimientos.delete"),
    movimientoController.deleteMovimiento);

module.exports = router;

