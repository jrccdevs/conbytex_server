const db = require("../config/db");

const Orden = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT o.*, 
             p.nombre_producto AS producto_terminado,
             e.nombre_empleado AS empleado
      FROM orden_produccion o
      JOIN productos p ON o.id_producto = p.id_producto
      JOIN empleados e ON o.id_empleado = e.id_empleado
    `);
    return rows;
  },

  getById: async (id) => {
    // Obtener la orden principal
    const [rows] = await db.query(`
      SELECT o.*, 
             p.nombre_producto AS producto_terminado,
             e.nombre_empleado AS empleado
      FROM orden_produccion o
      JOIN productos p ON o.id_producto = p.id_producto
      JOIN empleados e ON o.id_empleado = e.id_empleado
      WHERE o.id_orden = ?
    `, [id]);

    if (rows.length === 0) return null;

    const orden = rows[0];

    // Obtener los materiales de la receta para este producto
    const [materiales] = await db.query(`
      SELECT r.id_producto_material, mp.nombre_producto AS materia_prima, r.cantidad
      FROM receta r
      JOIN productos mp ON r.id_producto_material = mp.id_producto
      WHERE r.id_producto = ?
    `, [orden.id_producto]);

    // Multiplicar la cantidad de cada material por la cantidad solicitada
    const materialesMultiplicados = materiales.map(m => ({
      id_producto_material: m.id_producto_material,
      materia_prima: m.materia_prima,
      cantidad_necesaria: m.cantidad * orden.cantidad_solicitada
    }));

    return {
      ...orden,
      materiales: materialesMultiplicados
    };
  },

  create: async (data) => {
    const { id_producto, id_empleado, cantidad_solicitada } = data;
    const [result] = await db.query(
      `INSERT INTO orden_produccion 
        (id_producto, id_empleado, cantidad_solicitada)
       VALUES (?, ?, ?)`,
      [id_producto, id_empleado, cantidad_solicitada]
    );
    return { id_orden: result.insertId, ...data, estado: 'pendiente' };
  },

  update: async (id, data) => {
    const { id_producto, id_empleado, cantidad_solicitada, estado } = data;
    await db.query(
      `UPDATE orden_produccion SET 
        id_producto = ?, 
        id_empleado = ?, 
        cantidad_solicitada = ?, 
        estado = ?
       WHERE id_orden = ?`,
      [id_producto, id_empleado, cantidad_solicitada, estado, id]
    );
    return { id_orden: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM orden_produccion WHERE id_orden = ?", [id]);
    return { message: `Orden con id ${id} eliminada` };
  }
};

module.exports = Orden;
