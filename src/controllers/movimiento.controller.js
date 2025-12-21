const Movimiento = require("../models/movimiento.model");

exports.getMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.getAll();
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener movimientos", error });
  }
};

exports.getMovimientoById = async (req, res) => {
  try {
    const movimiento = await Movimiento.getById(req.params.id);
    if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado" });
    res.json(movimiento);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el movimiento", error });
  }
};

exports.createMovimiento = async (req, res) => {
  try {
    const { id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad } = req.body;
    
    if (!id_producto || !id_almacen || !id_empleado || !tipo_movimiento || !cantidad) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben estar presentes" });
    }

    const newMovimiento = await Movimiento.create(req.body);
    res.status(201).json({ message: "Movimiento registrado con éxito", movimiento: newMovimiento });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el movimiento", error });
  }
};

exports.updateMovimiento = async (req, res) => {
  try {
    const updatedMovimiento = await Movimiento.update(req.params.id, req.body);
    res.json({ message: "Movimiento actualizado", movimiento: updatedMovimiento });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el movimiento", error });
  }
};

exports.deleteMovimiento = async (req, res) => {
  try {
    const result = await Movimiento.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el movimiento", error });
  }
};