const Orden = require("../models/orden.model");

const Receta = require("../models/receta.model");
const db = require("../config/db"); // Importamos db para usar transacciones
exports.updateOrden = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id_producto, id_empleado, cantidad_solicitada, estado } = req.body;
    const id_orden = req.params.id;
    const estadoNuevo = estado.trim().toLowerCase();

    await connection.beginTransaction();

    const ordenAnterior = await Orden.getRawById(id_orden, connection);
    if (!ordenAnterior) throw new Error("Orden no encontrada");

    const estadoAnterior = ordenAnterior.estado;
    const cantidad = cantidad_solicitada;

    // 1️⃣ Actualizar estado
    await Orden.update(
      id_orden,
      { id_producto, id_empleado, cantidad_solicitada, estado: estadoNuevo },
      connection
    );

    // 2️⃣ TRANSICIONES
    if (estadoAnterior === "pendiente" && estadoNuevo === "en_proceso") {
      const insumos = await Receta.getByProducto(id_producto, connection);

      for (const item of insumos) {
        const totalReserva = item.cantidad * cantidad;

        const [[prod]] = await connection.query(
          "SELECT stock, stock_reservado FROM productos WHERE id_producto = ?",
          [item.id_producto_material]
        );

        const disponible = prod.stock - prod.stock_reservado;
        if (disponible < totalReserva) {
          throw new Error(`Stock insuficiente para MP ${item.id_producto_material}`);
        }

        await connection.query(
          "UPDATE productos SET stock_reservado = stock_reservado + ? WHERE id_producto = ?",
          [totalReserva, item.id_producto_material]
        );
      }
    }

    else if (estadoAnterior === "en_proceso" && estadoNuevo === "completada") {
      const insumos = await Receta.getInsumosProduccion(id_producto, connection);
      for (const item of insumos) {
        const total = item.cantidad * cantidad;
        await connection.query(
          "UPDATE productos SET stock = stock - ?, stock_reservado = stock_reservado - ? WHERE id_producto = ?",
          [total, total, item.id_producto_material]
        );
      }

      await connection.query(
        "UPDATE productos SET stock = stock + ? WHERE id_producto = ?",
        [cantidad, id_producto]
      );
    }

    await connection.commit();
    res.json({ message: "Orden actualizada correctamente" });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};
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



exports.deleteOrden = async (req, res) => {
  try {
    const result = await Orden.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
};
