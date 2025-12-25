const db = require("../config/db");

const Receta = {

  // =========================
  // CONSULTAS PARA UI / FRONTEND
  // =========================

  // Listar todas las recetas con nombres básicos
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

  // Obtener receta por ID individual
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

  // Obtener receta por producto (USO UI)
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

  // Obtener receta con detalles técnicos (Color, Material, Unidad)
  getRecetaCompleta: async (id_producto) => {
    const [rows] = await db.query(`
      SELECT r.*, 
             p.nombre_producto AS producto_terminado,
             m.nombre_producto AS materia_prima,
             col.nombre_color,
             mat.nombre_material,
             uni.nombre_unidad
      FROM receta r
      JOIN productos p ON r.id_producto = p.id_producto
      JOIN productos m ON r.id_producto_material = m.id_producto
      LEFT JOIN color col ON m.id_color = col.id_color
      LEFT JOIN materiales mat ON m.id_material = mat.id_material
      LEFT JOIN unidadesmedida uni ON m.id_unidadmedida = uni.id_unidad
      WHERE r.id_producto = ?
    `, [id_producto]);
    return rows;
  },

  // =========================
  // CONSULTA PARA PRODUCCIÓN
  // (ORDENES / INVENTARIO)
  // =========================
  // 👉 SOLO para lógica de negocio
  getInsumosProduccion: async (id_producto, connection = db) => {
    const [rows] = await connection.query(
      `SELECT 
         id_producto_material,
         cantidad
       FROM receta
       WHERE id_producto = ?`,
      [id_producto]
    );
    return rows;
  },

  // =========================
  // CRUD
  // =========================

  // Crear nueva entrada en la receta
  create: async (data) => {
    const { id_producto, id_producto_material, cantidad } = data;
    const [result] = await db.query(
      `INSERT INTO receta (id_producto, id_producto_material, cantidad)
       VALUES (?, ?, ?)`,
      [id_producto, id_producto_material, cantidad]
    );
    return { id_receta: result.insertId, ...data };
  },

  // Actualizar una entrada de la receta
  update: async (id, data) => {
    const { id_producto, id_producto_material, cantidad } = data;
    await db.query(
      `UPDATE receta 
       SET id_producto = ?, id_producto_material = ?, cantidad = ?
       WHERE id_receta = ?`,
      [id_producto, id_producto_material, cantidad, id]
    );
    return { id_receta: id, ...data };
  },

  // Eliminar un material de la receta
  delete: async (id) => {
    await db.query(
      "DELETE FROM receta WHERE id_receta = ?",
      [id]
    );
    return { message: `Receta con id ${id} eliminada` };
  }
};

module.exports = Receta;
