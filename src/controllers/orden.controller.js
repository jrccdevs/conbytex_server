const Orden = require("../models/orden.model");
const Receta = require("../models/receta.model");
const db = require("../config/db");

exports.updateOrden = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id_producto, id_empleado, cantidad_solicitada, estado } = req.body;
    const id_orden = req.params.id;

    const estadoNuevo = estado.trim().toLowerCase();
    const cantidad = Number(cantidad_solicitada);

    const ID_ALMACEN_MP = 1; // MATERIA PRIMA
    const ID_ALMACEN_PT = 2; // PRODUCTO TERMINADO

    await connection.beginTransaction();

    // 🔹 Obtener estado anterior
    const ordenAnterior = await Orden.getRawById(id_orden, connection);
    if (!ordenAnterior) throw new Error("Orden no encontrada");

    const estadoAnterior = ordenAnterior.estado;

    // 🔹 Actualizar orden
    await Orden.update(
      id_orden,
      { id_producto, id_empleado, cantidad_solicitada: cantidad, estado: estadoNuevo },
      connection
    );

    /*
    =====================================================
    1️⃣ De pendiente → en_proceso
       Reservar stock (NO descontar aún)
    =====================================================
    */
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
          throw new Error(
            `Stock insuficiente para materia prima ID ${item.id_producto_material}`
          );
        }

        await connection.query(
          "UPDATE productos SET stock_reservado = stock_reservado + ? WHERE id_producto = ?",
          [totalReserva, item.id_producto_material]
        );
      }
    }

    /*
    =====================================================
    2️⃣ De en_proceso → completado
       - Descontar MP (movimiento salida)
       - Liberar reserva
       - Ingresar PT (movimiento ingreso)
    =====================================================
    */
    if (estadoAnterior === "en_proceso" && estadoNuevo === "completado") {

      const insumos = await Receta.getInsumosProduccion(id_producto, connection);

      // 🔹 Descontar Materia Prima
      for (const item of insumos) {

        const totalMP = item.cantidad * cantidad;

        // Insertar movimiento SALIDA en MP
        await connection.query(
          `INSERT INTO movimientos_inventario
           (id_producto, id_almacen, tipo_movimiento, cantidad, fecha)
           VALUES (?, ?, 'salida', ?, NOW())`,
          [item.id_producto_material, ID_ALMACEN_MP, totalMP]
        );

        // Liberar stock reservado
        await connection.query(
          `UPDATE productos
           SET stock_reservado = stock_reservado - ?
           WHERE id_producto = ?`,
          [totalMP, item.id_producto_material]
        );
      }

      // 🔹 Ingresar Producto Terminado
      await connection.query(
        `INSERT INTO movimientos_inventario
         (id_producto, id_almacen, tipo_movimiento, cantidad, fecha)
         VALUES (?, ?, 'ingreso', ?, NOW())`,
        [id_producto, ID_ALMACEN_PT, cantidad]
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
  const connection = await db.getConnection();

  try {
    const { id_producto, id_empleado, cantidad_solicitada } = req.body;

    if (!id_producto || !id_empleado || !cantidad_solicitada) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const cantidad = Number(cantidad_solicitada);

    await connection.beginTransaction();

    // 🔹 Obtener receta
    const insumos = await Receta.getByProducto(id_producto, connection);

    if (!insumos || insumos.length === 0) {
      throw new Error("El producto no tiene receta asociada");
    }

    const erroresStock = [];

    for (const item of insumos) {
      const totalNecesario = item.cantidad * cantidad;

      const [[prod]] = await connection.query(
        "SELECT stock, stock_reservado, nombre_producto FROM productos WHERE id_producto = ?",
        [item.id_producto_material]
      );

      const disponible = prod.stock - prod.stock_reservado;

      if (disponible < totalNecesario) {
        erroresStock.push({
          producto: prod.nombre_producto,
          necesario: totalNecesario,
          disponible
        });
      }
    }

    if (erroresStock.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Stock insuficiente",
        items: erroresStock
      });
    }

    // 🔹 Crear orden si todo está correcto
    const newOrden = await Orden.create({
      id_producto,
      id_empleado,
      cantidad_solicitada: cantidad
    });

    await connection.commit();

    res.json({ message: "Orden creada", orden: newOrden });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
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
