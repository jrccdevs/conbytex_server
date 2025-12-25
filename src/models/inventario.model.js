const db = require("../config/db");

const Inventario = {
    obtenerStockPorAlmacen: async (id_almacen) => {
        const sql = `
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.tipo_producto,
                u.nombre_unidad, -- Ajusta este nombre si el campo se llama diferente (ej. unidad)
                IFNULL(SUM(
                    CASE 
                        WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                        WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                        WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad 
                        ELSE 0 
                    END
                ), 0) AS stock_actual
            FROM productos p
            -- Unión con tu tabla específica
            LEFT JOIN unidadesmedida u ON p.id_unidadmedida = u.id_unidad 
            LEFT JOIN movimientos_inventario m ON p.id_producto = m.id_producto AND m.id_almacen = ?
            WHERE p.activo = 1
            GROUP BY p.id_producto, p.nombre_producto, p.tipo_producto, u.nombre_unidad
        `;
        
        const [rows] = await db.query(sql, [id_almacen]);
        return rows;
    }
};

module.exports = Inventario;