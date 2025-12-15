const { Router } = require("express");
const router = Router();

const empleadoController = require("../controllers/empleado.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Rutas públicas
router.get("/", empleadoController.getEmpleados);
router.get("/:id", empleadoController.getEmpleadoById);

// Rutas protegidas solo admin
router.post("/", auth, role("admin"), empleadoController.createEmpleado);
router.put("/:id", auth, role("admin"), empleadoController.updateEmpleado);
router.delete("/:id", auth, role("admin"), empleadoController.deleteEmpleado);

module.exports = router;
