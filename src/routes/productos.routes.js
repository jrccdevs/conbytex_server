const { Router } = require("express");
const router = Router();

const productoController = require("../controllers/producto.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// 🔐 TODAS protegidas por permisos

router.get(
  "/",
  auth,
  permission("productos.view"),
  productoController.getProductos
);

router.get(
  "/:id",
  auth,
  permission("productos.view"),
  productoController.getProductoById
);

router.post(
  "/",
  auth,
  permission("productos.create"),
  productoController.createProducto
);

router.put(
  "/:id",
  auth,
  permission("productos.edit"),
  productoController.updateProducto
);

router.delete(
  "/:id",
  auth,
  permission("productos.delete"),
  productoController.deleteProducto
);

module.exports = router;
