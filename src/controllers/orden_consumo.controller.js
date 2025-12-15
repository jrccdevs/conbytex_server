const OrdenConsumo = require("../models/orden_consumo.model");

exports.getOrdenesConsumo = async (req, res) => {
  try {
    const consumos = await OrdenConsumo.getAll();
    res.json(consumos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener consumos", error });
  }
};

exports.getOrdenConsumoById = async (req, res) => {
  try {
    const consumo = await OrdenConsumo.getById(req.params.id);
    if (!consumo) return res.status(404).json({ message: "Consumo no encontrado" });
    res.json(consumo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el consumo", error });
  }
};

exports.createOrdenConsumo = async (req, res) => {
  try {
    const { id_orden, id_producto_material, cantidad_utilizada } = req.body;
    if (!id_orden || !id_producto_material || !cantidad_utilizada)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const newConsumo = await OrdenConsumo.create({ id_orden, id_producto_material, cantidad_utilizada });
    res.json({ message: "Consumo registrado", consumo: newConsumo });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el consumo", error });
  }
};

exports.updateOrdenConsumo = async (req, res) => {
  try {
    const { id_orden, id_producto_material, cantidad_utilizada } = req.body;
    if (!id_orden || !id_producto_material || !cantidad_utilizada)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const updatedConsumo = await OrdenConsumo.update(req.params.id, { id_orden, id_producto_material, cantidad_utilizada });
    res.json({ message: "Consumo actualizado", consumo: updatedConsumo });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el consumo", error });
  }
};

exports.deleteOrdenConsumo = async (req, res) => {
  try {
    const result = await OrdenConsumo.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el consumo", error });
  }
};
