const { Router } = require("express");
const router = Router();
const empleadoController = require("../controllers/empleado.controller");
const auth = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/auth.middleware").checkPermission;

// Rutas públicas protegidas con permiso de vista
router.get("/", auth, checkPermission("empleados", "view"), empleadoController.getEmpleados);
router.get("/:id", auth, checkPermission("empleados", "view"), empleadoController.getEmpleadoById);

// Rutas protegidas con permisos granulares
router.post("/", auth, checkPermission("empleados", "create"), empleadoController.createEmpleado);
router.put("/:id", auth, checkPermission("empleados", "edit"), empleadoController.updateEmpleado);
router.delete("/:id", auth, checkPermission("empleados", "delete"), empleadoController.deleteEmpleado);

module.exports = router;
