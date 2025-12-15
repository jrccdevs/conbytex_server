const Unidad = require("../models/unidad.model");

exports.getUnidades = async (req, res) => {
  try {
    const unidades = await Unidad.getAll();
    res.json(unidades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener unidades", error });
  }
};

exports.getUnidadById = async (req, res) => {
  try {
    const unidad = await Unidad.getById(req.params.id);
    if (!unidad) return res.status(404).json({ message: "Unidad no encontrada" });
    res.json(unidad);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la unidad", error });
  }
};

exports.createUnidad = async (req, res) => {
  try {
    const { nombre_unidad } = req.body;
    if (!nombre_unidad) return res.status(400).json({ message: "nombre_unidad es obligatorio" });

    const newUnidad = await Unidad.create(nombre_unidad);
    res.json({ message: "Unidad creada", unidad: newUnidad });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la unidad", error });
  }
};

exports.updateUnidad = async (req, res) => {
  try {
    const { nombre_unidad } = req.body;
    if (!nombre_unidad) return res.status(400).json({ message: "nombre_unidad es obligatorio" });

    const updatedUnidad = await Unidad.update(req.params.id, nombre_unidad);
    res.json({ message: "Unidad actualizada", unidad: updatedUnidad });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la unidad", error });
  }
};

exports.deleteUnidad = async (req, res) => {
  try {
    const result = await Unidad.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la unidad", error });
  }
};
