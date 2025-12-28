const { Router } = require("express");
const router = Router();

const productoController = require("../controllers/producto.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Públicas
router.get("/", productoController.getProductos);
router.get("/:id", productoController.getProductoById);

// Solo admin
router.post("/", auth, role("admin"), productoController.createProducto);
router.put("/:id", auth, role("admin"), productoController.updateProducto);
router.delete("/:id", auth, role("admin"), productoController.deleteProducto);

module.exports = router;
