
const { Router } = require("express");
const router = Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/sizes", require("./size.routes"));
router.use("/unidades", require("./unidad.routes"));
router.use("/almacenes", require("./almacen.routes"));
router.use("/colors", require("./color.routes"));
router.use("/materials", require("./material.routes"));
router.use("/empleados", require("./empleados.routes"));
router.use("/productos", require("./productos.routes"));
router.use("/recetas", require("./receta.routes"));
router.use("/ordenes", require("./orden.routes"));
router.use("/orden-consumo", require("./orden_consumo.routes"));
router.use("/movimientos", require("./movimiento.routes"));






module.exports = router;
