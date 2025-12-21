const db = require("../config/db");

const Movimiento = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT m.*, 
             p.nombre_producto,
             a.nombre_almacen,
             e.nombre_empleado AS empleado
      FROM movimientos_inventario m
      JOIN productos p ON m.id_producto = p.id_producto
      JOIN almacenes a ON m.id_almacen = a.id_almacen
      JOIN empleados e ON m.id_empleado = e.id_empleado
      ORDER BY m.fecha DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT m.*, 
             p.nombre_producto,
             a.nombre_almacen,
             e.nombre_empleado AS empleado
      FROM movimientos_inventario m
      JOIN productos p ON m.id_producto = p.id_producto
      JOIN almacenes a ON m.id_almacen = a.id_almacen
      JOIN empleados e ON m.id_empleado = e.id_empleado
      WHERE m.id_movimiento = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  create: async (data) => {
    const { id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion } = data;
    const [result] = await db.query(
      `INSERT INTO movimientos_inventario 
        (id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion]
    );
    return { id_movimiento: result.insertId, ...data, fecha: new Date() };
  },

  update: async (id, data) => {
    const { id_producto, id_almacen, id_empleado, tipo_movimiento, cantidad, descripcion } = data;
    await db.query(
      `UPDATE movimientos_inventario SET 
        id_producto = ?, 
        id_almacen = ?, 
        id_empleado = ?, 
        tipo_movimiento = ?, 
        cantidad = ?, 
        descripcion = ?
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