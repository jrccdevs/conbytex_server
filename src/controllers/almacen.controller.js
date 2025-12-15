const Almacen = require("../models/almacen.model");

exports.getAlmacenes = async (req, res) => {
  try {
    const almacenes = await Almacen.getAll();
    res.json(almacenes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener almacenes", error });
  }
};

exports.getAlmacenById = async (req, res) => {
  try {
    const almacen = await Almacen.getById(req.params.id);
    if (!almacen) return res.status(404).json({ message: "Almacén no encontrado" });
    res.json(almacen);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el almacén", error });
  }
};

exports.createAlmacen = async (req, res) => {
  try {
    const { nombre_almacen } = req.body;
    if (!nombre_almacen) return res.status(400).json({ message: "nombre_almacen es obligatorio" });

    const newAlmacen = await Almacen.create(nombre_almacen);
    res.json({ message: "Almacén creado", almacen: newAlmacen });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el almacén", error });
  }
};

exports.updateAlmacen = async (req, res) => {
  try {
    const { nombre_almacen } = req.body;
    if (!nombre_almacen) return res.status(400).json({ message: "nombre_almacen es obligatorio" });

    const updatedAlmacen = await Almacen.update(req.params.id, nombre_almacen);
    res.json({ message: "Almacén actualizado", almacen: updatedAlmacen });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el almacén", error });
  }
};

exports.deleteAlmacen = async (req, res) => {
  try {
    const result = await Almacen.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el almacén", error });
  }
};
