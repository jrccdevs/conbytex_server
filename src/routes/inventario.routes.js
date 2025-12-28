const { Router } = require("express");
const router = Router();
const inventarioController = require("../controllers/inventario.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Solo lectura: Permitido para usuarios autenticados con permiso 'view' en inventario
router.get(
  "/almacen/:id_almacen",
  auth,
  checkPermission("inventario", "view"),
  inventarioController.listarStockAlmacen
);

module.exports = router;
