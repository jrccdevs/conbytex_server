const db = require("../config/db");

const Movimiento = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT m.*, 
             p.nombre_producto,
             a.nombre_almacen,
             e.nombre_empleado AS empleado,
             u.nombre_unidad
      FROM movimientos_inventario m
      JOIN productos p ON m.id_producto = p.id_producto
      JOIN almacenes a ON m.id_almacen = a.id_almacen
      JOIN empleados e ON m.id_empleado = e.id_empleado
      LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad
      ORDER BY m.fecha DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT m.*, 
             p.nombre_producto,
             a.nombre_almacen,
             e.nombre_empleado AS empleado,
             u.nombre_unidad
      FROM movimientos_inventario m
      JOIN productos p ON m.id_producto = p.id_producto
      JOIN almacenes a ON m.id_almacen = a.id_almacen
      JOIN empleados e ON m.id_empleado = e.id_empleado
      LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad
      WHERE m.id_movimiento = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  create: async (data) => {
    const { id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion } = data;
    
    // Obtenemos una conexión para la transacción
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Insertar el movimiento
      const [result] = await connection.query(
        `INSERT INTO movimientos_inventario 
          (id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion]
      );

      // 2. Actualizar el stock en la tabla productos
      // 'ingreso' suma, 'salida' resta, 'ajuste' reemplaza
      let sqlStock = "";
      if (tipo_movimiento === 'ingreso') {
        sqlStock = "UPDATE productos SET stock = stock + ? WHERE id_producto = ?";
      } else if (tipo_movimiento === 'salida') {
        sqlStock = "UPDATE productos SET stock = stock - ? WHERE id_producto = ?";
      } else if (tipo_movimiento === 'ajuste') {
        sqlStock = "UPDATE productos SET stock = ? WHERE id_producto = ?";
      }

      await connection.query(sqlStock, [cantidad, id_producto]);

      // Confirmar transacción
      await connection.commit();
      
      return { id_movimiento: result.insertId, ...data, fecha: new Date() };
    } catch (error) {
      // Revertir en caso de error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Nota: El update y delete de movimientos usualmente no se recomiendan 
  // porque rompen la trazabilidad del stock, pero aquí se mantienen según tu código.
  update: async (id, data) => {
    const { id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion } = data;
    await db.query(
      `UPDATE movimientos_inventario SET 
        id_producto = ?, id_almacen = ?, id_empleado = ?, tipo_movimiento = ?, cantidad = ?, descripcion = ?
       WHERE id_movimiento = ?`,
      [id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion, id]
    );
    return { id_movimiento: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM movimientos_inventario WHERE id_movimiento = ?", [id]);
    return { message: `Movimiento con id ${id} eliminado` };
  }
};

module.exports = Movimiento;