const db = require("../config/db");

const Producto = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT p.*, 
             m.nombre_material,
             t.nombre_talla,
             c.nombre_color,
             u.nombre_unidad
      FROM productos p
      LEFT JOIN materiales m ON p.id_material = m.id_material
      LEFT JOIN sizes t ON p.id_talla = t.id_talla
      LEFT JOIN color c ON p.id_color = c.id_color
      LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT p.*, 
             m.nombre_material,
             t.nombre_talla,
             c.nombre_color,
             u.nombre_unidad
      FROM productos p
      LEFT JOIN materiales m ON p.id_material = m.id_material
      LEFT JOIN sizes t ON p.id_talla = t.id_talla
      LEFT JOIN color c ON p.id_color = c.id_color
      LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad
      WHERE p.id_producto = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const {
      nombre_producto,
      tipo_producto,
      id_material,
      id_talla,
      id_color,
      id_unidadmedida,
      activo
    } = data;

    const [result] = await db.query(
      `INSERT INTO productos 
      (nombre_producto, tipo_producto, id_material, id_talla, id_color, id_unidadmedida, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre_producto, tipo_producto, id_material, id_talla, id_color, id_unidadmedida, activo ?? 1]
    );

    return { id_producto: result.insertId, ...data };
  },

  update: async (id, data) => {
    const {
      nombre_producto,
      tipo_producto,
      id_material,
      id_talla,
      id_color,
      id_unidadmedida,
      activo
    } = data;

    await db.query(
      `UPDATE productos SET 
        nombre_producto = ?, 
        tipo_producto = ?, 
        id_material = ?, 
        id_talla = ?, 
        id_color = ?, 
        id_unidadmedida = ?, 
        activo = ?
       WHERE id_producto = ?`,
      [nombre_producto, tipo_producto, id_material, id_talla, id_color, id_unidadmedida, activo, id]
    );

    return { id_producto: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM productos WHERE id_producto = ?", [id]);
    return { message: `Producto con id ${id} eliminado` };
  }
};

module.exports = Producto;
