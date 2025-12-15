const Empleado = require("../models/empleado.model");

// Obtener todos los empleados
exports.getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.getAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", error });
  }
};

// Obtener empleado por ID
exports.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.getById(req.params.id);
    if (!empleado) return res.status(404).json({ message: "Empleado no encontrado" });

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el empleado", error });
  }
};

// Crear empleado
exports.createEmpleado = async (req, res) => {
  try {
    const { nombre_empleado, cargo, activo, id_usuario } = req.body;

    if (!nombre_empleado)
      return res.status(400).json({ message: "nombre_empleado es obligatorio" });

    const newEmpleado = await Empleado.create(
      nombre_empleado,
      cargo,
      activo ?? true,
      id_usuario || null
    );

    res.json({ message: "Empleado creado", empleado: newEmpleado });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el empleado", error });
  }
};

// Actualizar empleado
exports.updateEmpleado = async (req, res) => {
  try {
    const { nombre_empleado, cargo, activo, id_usuario } = req.body;

    if (!nombre_empleado)
      return res.status(400).json({ message: "nombre_empleado es obligatorio" });

    const updatedEmpleado = await Empleado.update(
      req.params.id,
      nombre_empleado,
      cargo,
      activo ?? true,
      id_usuario || null
    );

    res.json({ message: "Empleado actualizado", empleado: updatedEmpleado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el empleado", error });
  }
};

// Eliminar empleado
exports.deleteEmpleado = async (req, res) => {
  try {
    const result = await Empleado.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el empleado", error });
  }
};
