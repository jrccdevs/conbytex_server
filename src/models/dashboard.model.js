// dashboardModel.js

const db = require("../config/db");

const Dashboard = {

  resumenGeneral: async () => {

    const [[ingresos]] = await db.query(`
      SELECT COUNT(*) AS total_ingresos
      FROM movimientos_inventario
      WHERE tipo_movimiento = 'ingreso'
    `);

    const [[salidas]] = await db.query(`
      SELECT COUNT(*) AS total_salidas
      FROM movimientos_inventario
      WHERE tipo_movimiento = 'salida'
    `);

    const [[ventas]] = await db.query(`
      SELECT IFNULL(SUM(total),0) AS total_ventas
      FROM movimientos_inventario m
      JOIN productos p ON m.id_producto = p.id_producto
      WHERE m.tipo_movimiento = 'salida'
      AND p.tipo_producto = 'PT'
    `);

    return {
      ingresos: ingresos.total_ingresos,
      salidas: salidas.total_salidas,
      ventas: ventas.total_ventas
    };
  },

  movimientosPorMes: async () => {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') AS mes,
        SUM(CASE WHEN tipo_movimiento='ingreso' THEN cantidad ELSE 0 END) AS ingresos,
        SUM(CASE WHEN tipo_movimiento='salida' THEN cantidad ELSE 0 END) AS salidas
      FROM movimientos_inventario
      GROUP BY mes
      ORDER BY mes ASC
    `);

    return rows;
  },

  topProductos: async () => {
    const [rows] = await db.query(`
      SELECT 
        p.nombre_producto,
        SUM(m.cantidad) AS total_vendido
      FROM movimientos_inventario m
      JOIN productos p ON m.id_producto = p.id_producto
      WHERE m.tipo_movimiento = 'salida'
      AND p.tipo_producto = 'PT'
      GROUP BY p.id_producto
      ORDER BY total_vendido DESC
      LIMIT 5
    `);

    return rows;
  },

  topClientes: async () => {
    const [rows] = await db.query(`
      SELECT 
        c.nombre,
        SUM(m.total) AS total_comprado
      FROM movimientos_inventario m
      JOIN clientes c ON m.id_cliente = c.id_cliente
      WHERE m.tipo_movimiento = 'salida'
      GROUP BY c.id_cliente
      ORDER BY total_comprado DESC
      LIMIT 5
    `);

    return rows;
  }

};

module.exports = Dashboard;