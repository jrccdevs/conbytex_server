const Orden = require("../models/orden.model");
const Receta = require("../models/receta.model");
const db = require("../config/db");

 exports.updateOrden = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Obtener orden actual
    const [ordenRows] = await connection.query(
      "SELECT * FROM ordenes_produccion WHERE id_orden = ?",
      [id]
    );

    if (ordenRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const orden = ordenRows[0];
    const estadoAnterior = orden.estado;
    const estadoNuevo = estado;
    const cantidad = orden.cantidad_solicitada;
    const id_producto = orden.id_producto;

    // 2️⃣ Si no hay cambio de estado, salir
    if (estadoAnterior === estadoNuevo) {
      await connection.rollback();
      return res.status(400).json({ message: "No hay cambio de estado" });
    }

    /*
    =====================================================
    3️⃣ pendiente → en_proceso
       Validar y reservar stock
    =====================================================
    */
    if (estadoAnterior === "pendiente" && estadoNuevo === "en_proceso") {

      const insumos = await Receta.getByProducto(id_producto, connection);

      for (const item of insumos) {

        // 🔎 Calcular stock real desde movimientos
        const [[prod]] = await connection.query(
          `
          SELECT 
              IFNULL(SUM(
                  CASE 
                      WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                      WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                      WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad
                      ELSE 0
                  END
              ), 0) AS stock_fisico,
              IFNULL(p.stock_reservado, 0) AS stock_reservado
          FROM productos p
          LEFT JOIN movimientos_inventario m 
              ON p.id_producto = m.id_producto
          WHERE p.id_producto = ?
          GROUP BY p.id_producto, p.stock_reservado
          `,
          [item.id_producto_material]
        );

        const totalNecesario = item.cantidad * cantidad;
        const disponible = prod.stock_fisico - prod.stock_reservado;

        if (disponible < totalNecesario) {
          await connection.rollback();
          return res.status(400).json({
            message: `Stock insuficiente para el material ${item.id_producto_material}`
          });
        }
      }

      // 🔒 Reservar stock
      for (const item of insumos) {

        const totalReserva = item.cantidad * cantidad;

        await connection.query(
          `UPDATE productos
           SET stock_reservado = stock_reservado + ?
           WHERE id_producto = ?`,
          [totalReserva, item.id_producto_material]
        );
      }
    }

    /*
    =====================================================
    4️⃣ en_proceso → completado
       Descontar físico + liberar reserva + ingresar PT
    =====================================================
    */
    if (estadoAnterior === "en_proceso" && estadoNuevo === "completado") {

      const insumos = await Receta.getByProducto(id_producto, connection);

      for (const item of insumos) {

        const totalConsumo = item.cantidad * cantidad;

        // 📤 Registrar salida de materia prima
        await connection.query(
          `INSERT INTO movimientos_inventario
           (id_producto, tipo_movimiento, cantidad, motivo)
           VALUES (?, 'salida', ?, 'Producción completada')`,
          [item.id_producto_material, totalConsumo]
        );

        // 🔓 Liberar reserva
        await connection.query(
          `UPDATE productos
           SET stock_reservado = GREATEST(stock_reservado - ?, 0)
           WHERE id_producto = ?`,
          [totalConsumo, item.id_producto_material]
        );
      }

      // 📥 Ingresar producto terminado
      await connection.query(
        `INSERT INTO movimientos_inventario
         (id_producto, tipo_movimiento, cantidad, motivo)
         VALUES (?, 'ingreso', ?, 'Producción completada')`,
        [id_producto, cantidad]
      );
    }

    /*
    =====================================================
    5️⃣ en_proceso → cancelado
       Liberar reserva (sin movimientos físicos)
    =====================================================
    */
    if (estadoAnterior === "en_proceso" && estadoNuevo === "cancelado") {

      const insumos = await Receta.getByProducto(id_producto, connection);

      for (const item of insumos) {

        const totalReserva = item.cantidad * cantidad;

        await connection.query(
          `UPDATE productos
           SET stock_reservado = GREATEST(stock_reservado - ?, 0)
           WHERE id_producto = ?`,
          [totalReserva, item.id_producto_material]
        );
      }
    }

    // 6️⃣ Actualizar estado
    await connection.query(
      "UPDATE ordenes_produccion SET estado = ? WHERE id_orden = ?",
      [estadoNuevo, id]
    );

    await connection.commit();

    res.json({ message: "Orden actualizada correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la orden" });
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
        `
        SELECT 
            p.nombre_producto,
            IFNULL(SUM(
                CASE 
                    WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                    WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                    WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad
                    ELSE 0
                END
            ), 0) AS stock_fisico,
            IFNULL(p.stock_reservado, 0) AS stock_reservado
        FROM productos p
        LEFT JOIN movimientos_inventario m 
            ON p.id_producto = m.id_producto
        WHERE p.id_producto = ?
        GROUP BY p.id_producto, p.nombre_producto, p.stock_reservado
        `,
        [item.id_producto_material]
      );
      
      const disponible = prod.stock_fisico - prod.stock_reservado;
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
