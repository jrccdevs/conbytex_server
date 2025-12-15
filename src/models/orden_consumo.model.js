const db = require("../config/db");

const OrdenConsumo = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT oc.*, 
             p.nombre_producto AS materia_prima,
             o.id_producto AS producto_terminado_id,
             pt.nombre_producto AS producto_terminado
      FROM orden_consumo oc
      JOIN productos p ON oc.id_producto_material = p.id_producto
      JOIN orden_produccion o ON oc.id_orden = o.id_orden
      JOIN productos pt ON o.id_producto = pt.id_producto
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT oc.*, 
             p.nombre_producto AS materia_prima,
             o.id_producto AS producto_terminado_id,
             pt.nombre_producto AS producto_terminado
      FROM orden_consumo oc
      JOIN productos p ON oc.id_producto_material = p.id_producto
      JOIN orden_produccion o ON oc.id_orden = o.id_orden
      JOIN productos pt ON o.id_producto = pt.id_producto
      WHERE oc.id_consumo = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { id_orden, id_producto_material, cantidad_utilizada } = data;

    const [result] = await db.query(
      `INSERT INTO orden_consumo 
       (id_orden, id_producto_material, cantidad_utilizada)
       VALUES (?, ?, ?)`,
      [id_orden, id_producto_material, cantidad_utilizada]
    );
    return { id_consumo: result.insertId, ...data };
  },

  update: async (id, data) => {
    const { id_orden, id_producto_material, cantidad_utilizada } = data;
    await db.query(
      `UPDATE orden_consumo SET 
         id_orden = ?, 
         id_producto_material = ?, 
         cantidad_utilizada = ?
       WHERE id_consumo = ?`,
      [id_orden, id_producto_material, cantidad_utilizada, id]
    );
    return { id_consumo: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM orden_consumo WHERE id_consumo = ?", [id]);
    return { message: `Registro de consumo con id ${id} eliminado` };
  }
};

module.exports = OrdenConsumo;
