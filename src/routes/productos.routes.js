const { Router } = require("express");
const router = Router();
const productoController = require("../controllers/producto.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas protegidas por permisos
router.get("/", auth, checkPermission("productos", "view"), productoController.getProductos);
router.get("/:id", auth, checkPermission("productos", "view"), productoController.getProductoById);

router.post("/", auth, checkPermission("productos", "create"), productoController.createProducto);
router.put("/:id", auth, checkPermission("productos", "edit"), productoController.updateProducto);
router.delete("/:id", auth, checkPermission("productos", "delete"), productoController.deleteProducto);

module.exports = router;
