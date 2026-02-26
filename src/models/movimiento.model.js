const db = require("../config/db");

const Movimiento = {
  getAll: async () => {
    const [rows] = await db.query(`
    SELECT m.*, 
    p.nombre_producto,
    mat.nombre_material,
    c.nombre_color,
    t.nombre_talla,
    a.nombre_almacen,
    e.nombre_empleado AS empleado,
    cli.nombre AS cliente,
    u.nombre_unidad 
FROM movimientos_inventario m
JOIN productos p ON m.id_producto = p.id_producto
LEFT JOIN materiales mat ON p.id_material = mat.id_material
LEFT JOIN color c ON p.id_color = c.id_color
LEFT JOIN sizes t ON p.id_talla = t.id_talla
JOIN almacenes a ON m.id_almacen = a.id_almacen
JOIN empleados e ON m.id_empleado = e.id_empleado
LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad
LEFT JOIN clientes cli ON m.id_cliente = cli.id_cliente
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
             cli.nombre AS cliente_nombre,
             cli.tipo_documento,
             cli.numero_documento,
             u.nombre_unidad
      FROM movimientos_inventario m
      JOIN productos p ON m.id_producto = p.id_producto
      JOIN almacenes a ON m.id_almacen = a.id_almacen
      JOIN empleados e ON m.id_empleado = e.id_empleado
      LEFT JOIN clientes cli ON m.id_cliente = cli.id_cliente
      LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad
      WHERE m.id_movimiento = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  create: async (data) => {
    const { 
      id_producto, 
      id_almacen, 
      id_empleado, 
      id_cliente,
      tipo_movimiento, 
      cantidad, 
      descripcion,
      precio_unitario: precioInput
    } = data;
  
    const connection = await db.getConnection();
      
    try {
      await connection.beginTransaction();
  
      // VALIDACIÓN: cantidad positiva
      if (cantidad <= 0) {
        throw new Error("La cantidad debe ser un número positivo.");
      }
  
      // 🔎 Obtener información del producto
      const [productoRows] = await connection.query(
        `SELECT tipo_producto, precio_base 
         FROM productos 
         WHERE id_producto = ?`,
        [id_producto]
      );
  
      if (productoRows.length === 0) {
        throw new Error("Producto no encontrado");
      }
  
      const producto = productoRows[0];
  
      let precio_unitario = null;
      let total = null;
  
      // 💰 LÓGICA FINANCIERA SOLO PARA SALIDA DE PT
      if (tipo_movimiento === 'salida' && producto.tipo_producto === 'PT') {

        if (!id_cliente) {
          throw new Error("Debe seleccionar un cliente para salida de Producto Terminado");
        }
      
        const [clienteRows] = await connection.query(
          `SELECT estado FROM clientes WHERE id_cliente = ?`,
          [id_cliente]
        );
      
        if (clienteRows.length === 0) {
          throw new Error("Cliente no encontrado");
        }
      
        if (clienteRows[0].estado === 0) {
          throw new Error("El cliente está inactivo");
        }
        
        // Si el usuario envía precio, usamos ese
        if (precioInput !== undefined && precioInput !== null) {
          precio_unitario = Number(precioInput);
        } else {
          precio_unitario = Number(producto.precio_base);
        }
  
        if (!precio_unitario || precio_unitario <= 0) {
          throw new Error("El precio_unitario debe ser mayor que 0 para salidas de PT");
        }
  
        total = Number((cantidad * precio_unitario).toFixed(2));
      }
  
      // 🔎 VALIDACIÓN DE STOCK PARA SALIDAS
      if (tipo_movimiento === 'salida') {
        const [stockRows] = await connection.query(
          `SELECT 
              SUM(CASE 
                  WHEN tipo_movimiento = 'ingreso' THEN cantidad 
                  WHEN tipo_movimiento = 'salida' THEN -cantidad
                  WHEN tipo_movimiento = 'ajuste' THEN cantidad 
                  ELSE 0 END) AS stock_actual
           FROM movimientos_inventario 
           WHERE id_producto = ? AND id_almacen = ?`,
          [id_producto, id_almacen]
        );
  
        const stockDisponible = stockRows[0].stock_actual || 0;
  
        if (cantidad > stockDisponible) {
          throw new Error(`Stock insuficiente en este almacén. Disponible: ${stockDisponible}`);
        }
      }
  
      // 📝 Insertar movimiento con precio y total
      const [result] = await connection.query(
        `INSERT INTO movimientos_inventario 
         (id_producto, id_almacen, id_empleado, id_cliente, tipo_movimiento, cantidad, descripcion, precio_unitario, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_producto,
          id_almacen,
          id_empleado,
          id_cliente || null,
          tipo_movimiento,
          cantidad,
          descripcion,
          precio_unitario,
          total
        ]
      );
  
      // 📦 Actualizar stock
      let sqlStock = "";
      if (tipo_movimiento === 'ingreso') {
        sqlStock = "UPDATE productos SET stock = stock + ? WHERE id_producto = ?";
        await connection.query(sqlStock, [cantidad, id_producto]);
      } else if (tipo_movimiento === 'salida') {
        sqlStock = "UPDATE productos SET stock = stock - ? WHERE id_producto = ?";
        await connection.query(sqlStock, [cantidad, id_producto]);
      } else if (tipo_movimiento === 'ajuste') {
        sqlStock = "UPDATE productos SET stock = ? WHERE id_producto = ?";
        await connection.query(sqlStock, [cantidad, id_producto]);
      }
  
      await connection.commit();
  
      return { 
        id_movimiento: result.insertId, 
        ...data, 
        precio_unitario,
        total,
        fecha: new Date() 
      };
  
    } catch (error) {
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