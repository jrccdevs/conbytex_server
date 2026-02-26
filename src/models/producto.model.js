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
// NUEVO MÉTODO PARA VALIDAR
getByCodigo: async (codigo) => {
  const [rows] = await db.query("SELECT * FROM productos WHERE codigo = ?", [codigo]);
  return rows[0];
},
create: async (data) => {
  const existe = await Producto.getByCodigo(data.codigo);
  if (existe) {
    throw new Error("EL_CODIGO_YA_EXISTE");
  }

  const {
    codigo,
    nombre_producto,
    tipo_producto,
    id_material,
    id_talla,
    id_color,
    id_unidadmedida,
    stock_minimo,
    activo,
    costo_unitario,
    precio_base
  } = data;

  const [result] = await db.query(
    `INSERT INTO productos 
    (codigo, nombre_producto, tipo_producto, id_material, id_talla, id_color, 
     id_unidadmedida, stock, stock_minimo, activo, costo_unitario, precio_base)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
    [
      codigo,
      nombre_producto,
      tipo_producto,
      id_material,
      id_talla,
      id_color,
      id_unidadmedida,
      stock_minimo ?? 0,
      activo ?? 1,
      costo_unitario ?? null,
      precio_base ?? null
    ]
  );

  return { id_producto: result.insertId, ...data, stock: 0 };
},
update: async (id, data) => {
  const {
    codigo,
    nombre_producto,
    tipo_producto,
    id_material,
    id_talla,
    id_color,
    id_unidadmedida,
    stock_minimo,
    activo,
    costo_unitario,
    precio_base
  } = data;

  await db.query(
    `UPDATE productos SET 
      codigo = ?,
      nombre_producto = ?, 
      tipo_producto = ?, 
      id_material = ?, 
      id_talla = ?, 
      id_color = ?, 
      id_unidadmedida = ?, 
      stock_minimo = ?,
      activo = ?,
      costo_unitario = ?,
      precio_base = ?
     WHERE id_producto = ?`,
    [
      codigo,
      nombre_producto,
      tipo_producto,
      id_material,
      id_talla,
      id_color,
      id_unidadmedida,
      stock_minimo,
      activo,
      costo_unitario ?? null,
      precio_base ?? null,
      id
    ]
  );

  return { id_producto: id, ...data };
},

  delete: async (id) => {
    await db.query("DELETE FROM productos WHERE id_producto = ?", [id]);
    return { message: `Producto con id ${id} eliminado` };
  },
  getConReceta: async () => {
    const [rows] = await db.query(`
    SELECT DISTINCT 
    p.id_producto,
    p.codigo,
    p.tipo_producto,
    CONCAT(
        ' [', p.codigo, '] ',
        p.nombre_producto,
        IF(m.nombre_material IS NOT NULL, CONCAT(' - ', m.nombre_material), ''),
        IF(c.nombre_color IS NOT NULL, CONCAT(' - ', c.nombre_color), '')
    ) AS nombre_completo,
    m.nombre_material,
    c.nombre_color,
    u.nombre_unidad
FROM productos p
INNER JOIN receta r 
    ON r.id_producto = p.id_producto
LEFT JOIN materiales m ON p.id_material = m.id_material
LEFT JOIN color c ON p.id_color = c.id_color
LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad
WHERE p.tipo_producto = 'PT'
    `);
    return rows;
  }

};

module.exports = Producto;