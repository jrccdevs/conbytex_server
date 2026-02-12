const { Router } = require("express");
const router = Router();
const inventarioController = require("../controllers/inventario.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");
// Solo lectura: Permitido para empleados y admin previa autenticación
router.get(
    "/almacen/:id_almacen", 
    auth, 
    permission("inventario.view"),
    inventarioController.listarStockAlmacen);

module.exports = router;

