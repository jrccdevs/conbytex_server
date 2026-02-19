const db = require('../../config/db'); // ajusta si tu ruta es diferente

exports.getDashboardData = async () => {

  const connection = await db.getConnection();

  try {

    /*
    ==========================================
    1️⃣ Conteo de órdenes por estado
    ==========================================
    */
    const [rows] = await connection.query(`
      SELECT estado, COUNT(*) as total
      FROM ordenes_produccion
      GROUP BY estado
    `);

    const resumen = {
      pendientes: 0,
      en_proceso: 0,
      completadas: 0,
      canceladas: 0,
      total: 0,
      completadas_hoy: 0,
      tasa_cancelacion: 0
    };

    rows.forEach(r => {
      resumen.total += r.total;

      if (r.estado === 'pendiente') resumen.pendientes = r.total;
      if (r.estado === 'en_proceso') resumen.en_proceso = r.total;
      if (r.estado === 'completado') resumen.completadas = r.total;
      if (r.estado === 'cancelado') resumen.canceladas = r.total;
    });

    /*
    ==========================================
    2️⃣ Órdenes completadas hoy
    ==========================================
    */
    const [hoyRows] = await connection.query(`
      SELECT COUNT(*) as total
      FROM orden_produccion
      WHERE estado = 'completado'
      AND DATE(fecha) = CURDATE()
    `);

    resumen.completadas_hoy = hoyRows[0].total;

    /*
    ==========================================
    3️⃣ Tasa de cancelación
    ==========================================
    */
    if (resumen.total > 0) {
      resumen.tasa_cancelacion = Number(
        ((resumen.canceladas / resumen.total) * 100).toFixed(2)
      );
    }

    return { ordenes: resumen };

  } finally {
    connection.release();
  }
};
