const { Router } = require("express");
const router = Router();
const inventarioController = require("../controllers/inventario.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Solo lectura: Permitido para empleados y admin previa autenticación
router.get("/almacen/:id_almacen", auth, inventarioController.listarStockAlmacen);

module.exports = router;