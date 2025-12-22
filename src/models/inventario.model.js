const db = require("../config/db"); // Ajusta según tu configuración de conexión

const Inventario = {
    obtenerStockPorAlmacen: async (id_almacen) => {
        const sql = `
            SELECT 
                p.id_producto,
                p.nombre_producto,
                SUM(
                    CASE 
                        WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                        WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                        WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad 
                        ELSE 0 
                    END
                ) AS stock_actual
            FROM movimientos_inventario m
            INNER JOIN productos p ON m.id_producto = p.id_producto
            WHERE m.id_almacen = ?
            GROUP BY p.id_producto, p.nombre_producto
        `;
        const [rows] = await db.query(sql, [id_almacen]);
        return rows;
    }
};

module.exports = Inventario;