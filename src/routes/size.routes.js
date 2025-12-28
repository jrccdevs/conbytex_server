const { Router } = require("express");
const router = Router();
const sizeController = require("../controllers/size.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/auth.middleware");

// Rutas protegidas por permisos
router.get("/", auth, checkPermission("sizes", "view"), sizeController.getSizes);
router.get("/:id", auth, checkPermission("sizes", "view"), sizeController.getSizeById);

router.post("/", auth, checkPermission("sizes", "create"), sizeController.createSize);
router.put("/:id", auth, checkPermission("sizes", "edit"), sizeController.updateSize);
router.delete("/:id", auth, checkPermission("sizes", "delete"), sizeController.deleteSize);

module.exports = router;
