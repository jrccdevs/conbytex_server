const Receta = require("../models/receta.model");

exports.getRecetas = async (req, res) => {
  try {
    const recetas = await Receta.getAll();
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener recetas", error });
  }
};

exports.getRecetaById = async (req, res) => {
  try {
    const receta = await Receta.getById(req.params.id);
    if (!receta) return res.status(404).json({ message: "Receta no encontrada" });
    res.json(receta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la receta", error });
  }
};

// NUEVO: Obtener recetas por producto terminado
exports.getRecetasByProducto = async (req, res) => {
  try {
    const recetas = await Receta.getByProducto(req.params.id_producto);
    if (!recetas || recetas.length === 0) 
      return res.status(404).json({ message: "No hay materias primas para este producto" });
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener recetas por producto", error });
  }
};

exports.createReceta = async (req, res) => {
  try {
    const { id_producto, id_producto_material, cantidad } = req.body;
    if (!id_producto || !id_producto_material || !cantidad)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const newReceta = await Receta.create({ id_producto, id_producto_material, cantidad });
    res.json({ message: "Receta creada", receta: newReceta });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la receta", error });
  }
};

exports.updateReceta = async (req, res) => {
  try {
    const { id_producto, id_producto_material, cantidad } = req.body;
    if (!id_producto || !id_producto_material || !cantidad)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const updatedReceta = await Receta.update(req.params.id, { id_producto, id_producto_material, cantidad });
    res.json({ message: "Receta actualizada", receta: updatedReceta });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la receta", error });
  }
};

exports.deleteReceta = async (req, res) => {
  try {
    const result = await Receta.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la receta", error });
  }
};
exports.getRecetaCompleta = async (req, res) => {
  try {
    const receta = await Receta.getRecetaCompleta(req.params.id_producto);
    if (!receta || receta.length === 0) 
      return res.status(404).json({ message: "Receta no encontrada" });
    res.json(receta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la receta completa", error });
  }
};