const Cliente = require("../models/cliente.model");

// 🔹 Validación simple email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.getAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.getById(req.params.id);
    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cliente" });
  }
};

exports.createCliente = async (req, res) => {
  try {
    const {
      codigo_cliente,
      nombre,
      email,
      telefono,
      tipo_documento,
      numero_documento
    } = req.body;

    if (!codigo_cliente || !nombre || !tipo_documento || !numero_documento) {
      return res.status(400).json({
        message: "Código, nombre, tipo_documento y numero_documento son obligatorios"
      });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email inválido"
      });
    }

    if (telefono && !/^\d+$/.test(telefono)) {
      return res.status(400).json({
        message: "El teléfono solo debe contener números"
      });
    }

    const newCliente = await Cliente.create(req.body);

    res.json({ message: "Cliente creado", cliente: newCliente });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const {
      codigo_cliente,
      nombre,
      email,
      telefono,
      tipo_documento,
      numero_documento
    } = req.body;

    if (!codigo_cliente || !nombre || !tipo_documento || !numero_documento) {
      return res.status(400).json({
        message: "Código, nombre, tipo_documento y numero_documento son obligatorios"
      });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email inválido"
      });
    }

    if (telefono && !/^\d+$/.test(telefono)) {
      return res.status(400).json({
        message: "El teléfono solo debe contener números"
      });
    }

    const updatedCliente = await Cliente.update(
      req.params.id,
      req.body
    );

    res.json({ message: "Cliente actualizado", cliente: updatedCliente });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const result = await Cliente.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};