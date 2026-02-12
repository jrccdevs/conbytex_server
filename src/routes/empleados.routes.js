const { Router } = require("express");
const router = Router();

const empleadoController = require("../controllers/empleado.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// Rutas públicas
router.get(
    "/",
    auth, 
    permission("empleados.view"),
    empleadoController.getEmpleados);


router.get(
    "/:id",
    auth,
    permission("empleados.view"),
    empleadoController.getEmpleadoById);

// Rutas protegidas solo admin
router.post(
    "/", 
    auth, 
    permission("empleados.create"),
    empleadoController.createEmpleado);
router.put(
    "/:id", 
    auth, 
    permission("empleados.edit"),
    empleadoController.updateEmpleado);

router.delete(
    "/:id", 
    auth, 
    permission("empleados.delete"), 
    empleadoController.deleteEmpleado);

module.exports = router;
