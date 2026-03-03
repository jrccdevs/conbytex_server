const Dashboard = require("../models/dashboard.model");

const getDashboardData = async (req, res) => {
  try {

    const resumen = await Dashboard.resumenGeneral();
    const movimientosMes = await Dashboard.movimientosPorMes();
    const topProductos = await Dashboard.topProductos();
    const topClientes = await Dashboard.topClientes();

    res.json({
      resumen,
      movimientosMes,
      topProductos,
      topClientes
    });

  } catch (error) {
    console.error("🔥 ERROR DASHBOARD COMPLETO:", error);
    res.status(500).json({
      message: "Error interno dashboard",
      error: error.message
    });
  }
};

module.exports = { getDashboardData };