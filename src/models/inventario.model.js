const db = require("../config/db");

const Inventario = {
    obtenerStockPorAlmacen: async (id_almacen) => {
        const sql = `
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.tipo_producto,
                u.nombre_unidad,
                p.stock_reservado,
                -- El stock actual viene de la suma de movimientos
                IFNULL(SUM(
                    CASE 
                        WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                        WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                        WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad 
                        ELSE 0 
                    END
                ), 0) AS stock_fisico,
                -- El disponible es lo físico menos lo comprometido en órdenes "en proceso"
                (IFNULL(SUM(
                    CASE 
                        WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                        WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                        WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad 
                        ELSE 0 
                    END
                ), 0) - p.stock_reservado) AS stock_disponible
            FROM productos p
            LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad 
            LEFT JOIN movimientos_inventario m ON p.id_producto = m.id_producto AND m.id_almacen = ?
            WHERE p.activo = 1
            GROUP BY p.id_producto, p.nombre_producto, p.tipo_producto, u.nombre_unidad, p.stock_reservado
        `;
        
        const [rows] = await db.query(sql, [id_almacen]);
        return rows;
    }
};

module.exports = Inventario;