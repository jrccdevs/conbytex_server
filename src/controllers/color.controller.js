const Color = require("../models/color.model");

exports.getColors = async (req, res) => {
  try {
    const colors = await Color.getAll();
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener colores", error });
  }
};

exports.getColorById = async (req, res) => {
  try {
    const color = await Color.getById(req.params.id);
    if (!color) return res.status(404).json({ message: "Color no encontrado" });
    res.json(color);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el color", error });
  }
};

exports.createColor = async (req, res) => {
  try {
    const { nombre_color } = req.body;
    if (!nombre_color) return res.status(400).json({ message: "nombre_color es obligatorio" });

    const newColor = await Color.create(nombre_color);
    res.json({ message: "Color creado", color: newColor });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el color", error });
  }
};

exports.updateColor = async (req, res) => {
  try {
    const { nombre_color } = req.body;
    if (!nombre_color) return res.status(400).json({ message: "nombre_color es obligatorio" });

    const updatedColor = await Color.update(req.params.id, nombre_color);
    res.json({ message: "Color actualizado", color: updatedColor });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el color", error });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const result = await Color.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el color", error });
  }
};
