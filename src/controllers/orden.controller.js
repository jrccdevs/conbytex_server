const Orden = require("../models/orden.model");

exports.getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.getAll();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener órdenes", error });
  }
};

exports.getOrdenById = async (req, res) => {
  try {
    const orden = await Orden.getById(req.params.id);
    if (!orden) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden", error });
  }
};

exports.createOrden = async (req, res) => {
  try {
    const { id_producto, id_empleado, cantidad_solicitada } = req.body;
    if (!id_producto || !id_empleado || !cantidad_solicitada)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const newOrden = await Orden.create({ id_producto, id_empleado, cantidad_solicitada });
    res.json({ message: "Orden creada", orden: newOrden });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error });
  }
};

exports.updateOrden = async (req, res) => {
  try {
    const { id_producto, id_empleado, cantidad_solicitada, estado } = req.body;
    if (!id_producto || !id_empleado || !cantidad_solicitada || !estado)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const updatedOrden = await Orden.update(req.params.id, { id_producto, id_empleado, cantidad_solicitada, estado });
    res.json({ message: "Orden actualizada", orden: updatedOrden });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden", error });
  }
};

exports.deleteOrden = async (req, res) => {
  try {
    const result = await Orden.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
};
