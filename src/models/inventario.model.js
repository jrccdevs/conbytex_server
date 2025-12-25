const db = require("../config/db");

const Inventario = {
    obtenerStockPorAlmacen: async (id_almacen) => {
        const sql = `
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.tipo_producto,
                -- Usamos IFNULL para que si no hay movimientos, el stock sea 0
                IFNULL(SUM(
                    CASE 
                        WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                        WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                        WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad 
                        ELSE 0 
                    END
                ), 0) AS stock_actual
            FROM productos p
            -- Cambiamos a LEFT JOIN empezando por Productos
            -- Y añadimos la condición del almacén dentro del ON para no excluir productos
            LEFT JOIN movimientos_inventario m ON p.id_producto = m.id_producto AND m.id_almacen = ?
            WHERE p.activo = 1 -- Opcional: solo mostrar productos activos
            GROUP BY p.id_producto, p.nombre_producto, p.tipo_producto
        `;
        const [rows] = await db.query(sql, [id_almacen]);
        return rows;
    }
};

module.exports = Inventario;