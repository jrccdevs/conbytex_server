const Size = require("../models/size.model");

exports.getSizes = async (req, res) => {
  try {
    const sizes = await Size.getAll();
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tallas", error });
  }
};

exports.getSizeById = async (req, res) => {
  try {
    const size = await Size.getById(req.params.id);
    if (!size) return res.status(404).json({ message: "Talla no encontrada" });
    res.json(size);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la talla", error });
  }
};

exports.createSize = async (req, res) => {
  try {
    const { nombre_talla } = req.body;
    if (!nombre_talla) return res.status(400).json({ message: "nombre_talla es obligatorio" });

    const newSize = await Size.create(nombre_talla);
    res.json({ message: "Talla creada", size: newSize });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la talla", error });
  }
};

exports.updateSize = async (req, res) => {
  try {
    const { nombre_talla } = req.body;
    if (!nombre_talla) return res.status(400).json({ message: "nombre_talla es obligatorio" });

    const updatedSize = await Size.update(req.params.id, nombre_talla);
    res.json({ message: "Talla actualizada", size: updatedSize });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la talla", error });
  }
};

exports.deleteSize = async (req, res) => {
  try {
    const result = await Size.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la talla", error });
  }
};
