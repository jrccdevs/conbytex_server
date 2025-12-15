const db = require("../config/db");

const Receta = {
  // Listar todas las recetas
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT r.*, 
             p.nombre_producto AS producto_terminado,
             m.nombre_producto AS materia_prima
      FROM receta r
      JOIN productos p ON r.id_producto = p.id_producto
      JOIN productos m ON r.id_producto_material = m.id_producto
    `);
    return rows;
  },

  // Obtener receta por ID
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT r.*, 
             p.nombre_producto AS producto_terminado,
             m.nombre_producto AS materia_prima
      FROM receta r
      JOIN productos p ON r.id_producto = p.id_producto
      JOIN productos m ON r.id_producto_material = m.id_producto
      WHERE r.id_receta = ?
    `, [id]);
    return rows[0];
  },

  // Obtener todas las recetas de un producto específico
  getByProducto: async (id_producto) => {
    const [rows] = await db.query(`
      SELECT r.*, 
             p.nombre_producto AS producto_terminado,
             m.nombre_producto AS materia_prima
      FROM receta r
      JOIN productos p ON r.id_producto = p.id_producto
      JOIN productos m ON r.id_producto_material = m.id_producto
      WHERE r.id_producto = ?
    `, [id_producto]);
    return rows;
  },

  // Crear nueva receta
  create: async (data) => {
    const { id_producto, id_producto_material, cantidad } = data;
    const [result] = await db.query(
      `INSERT INTO receta (id_producto, id_producto_material, cantidad)
       VALUES (?, ?, ?)`,
      [id_producto, id_producto_material, cantidad]
    );
    return { id_receta: result.insertId, ...data };
  },

  // Actualizar receta
  update: async (id, data) => {
    const { id_producto, id_producto_material, cantidad } = data;
    await db.query(
      `UPDATE receta SET id_producto = ?, id_producto_material = ?, cantidad = ?
       WHERE id_receta = ?`,
      [id_producto, id_producto_material, cantidad, id]
    );
    return { id_receta: id, ...data };
  },

  // Eliminar receta
  delete: async (id) => {
    await db.query("DELETE FROM receta WHERE id_receta = ?", [id]);
    return { message: `Receta con id ${id} eliminada` };
  }
};
// En receta.model.js
Receta.getRecetaCompleta = async (id_producto) => {
  const [rows] = await db.query(`
    SELECT r.*, 
           p.nombre_producto AS producto_terminado,
           m.nombre_producto AS materia_prima,
           m.nombre_color,
           m.nombre_material,
           m.nombre_unidad
    FROM receta r
    JOIN productos p ON r.id_producto = p.id_producto
    JOIN productos m ON r.id_producto_material = m.id_producto
    WHERE r.id_producto = ?
  `, [id_producto]);

  return rows;
};
module.exports = Receta;
