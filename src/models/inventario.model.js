const db = require("../config/db");

const Inventario = {
    obtenerStockPorAlmacen: async (id_almacen) => {
        const sql = `
            SELECT 
                p.id_producto,
                p.codigo,
                p.nombre_producto,
                mat.nombre_material,
                col.nombre_color,
                t.nombre_talla,
                p.tipo_producto,
                u.nombre_unidad,

                -- Solo MP tiene reserva
                CASE 
                    WHEN ? = 1 THEN IFNULL(p.stock_reservado, 0)
                    ELSE 0
                END AS stock_reservado,

                -- Stock físico según movimientos
                IFNULL(SUM(
                    CASE 
                        WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                        WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                        WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad 
                        ELSE 0 
                    END
                ), 0) AS stock_fisico,

                -- Disponible
                (
                    IFNULL(SUM(
                        CASE 
                            WHEN m.tipo_movimiento = 'ingreso' THEN m.cantidad 
                            WHEN m.tipo_movimiento = 'salida' THEN -m.cantidad
                            WHEN m.tipo_movimiento = 'ajuste' THEN m.cantidad 
                            ELSE 0 
                        END
                    ), 0)
                    -
                    CASE 
                        WHEN ? = 1 THEN IFNULL(p.stock_reservado, 0)
                        ELSE 0
                    END
                ) AS stock_disponible

            FROM productos p

            LEFT JOIN materiales mat 
                ON p.id_material = mat.id_material

            LEFT JOIN color col 
                ON p.id_color = col.id_color

            LEFT JOIN sizes t
                ON p.id_talla = t.id_talla

            LEFT JOIN unidadesmedida u 
                ON p.id_unidadmedida = u.id_unidad 

            LEFT JOIN movimientos_inventario m 
                ON p.id_producto = m.id_producto 
                AND m.id_almacen = ?

            WHERE p.activo = 1

            GROUP BY 
                p.id_producto,
                p.codigo,
                p.nombre_producto,
                mat.nombre_material,
                col.nombre_color,
                t.nombre_talla,
                p.tipo_producto, 
                u.nombre_unidad,
                p.stock_reservado
        `;

        const [rows] = await db.query(sql, [id_almacen, id_almacen, id_almacen]);
        return rows;
    }
};

module.exports = Inventario;
