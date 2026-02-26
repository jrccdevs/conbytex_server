const { Router } = require("express");
const router = Router();

const clienteController = require("../controllers/cliente.controller");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

// 🔹 Ver todos los clientes
router.get(
  "/",
  auth,
  permission("clientes.view"),
  clienteController.getClientes
);

// 🔹 Ver cliente por ID
router.get(
  "/:id",
  auth,
  permission("clientes.view"),
  clienteController.getClienteById
);

// 🔹 Crear cliente
router.post(
  "/",
  auth,
  permission("clientes.create"),
  clienteController.createCliente
);

// 🔹 Actualizar cliente
router.put(
  "/:id",
  auth,
  permission("clientes.edit"),
  clienteController.updateCliente
);

// 🔹 Eliminar cliente
router.delete(
  "/:id",
  auth,
  permission("clientes.delete"),
  clienteController.deleteCliente
);

module.exports = router;