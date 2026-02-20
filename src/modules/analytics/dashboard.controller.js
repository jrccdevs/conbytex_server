const dashboardService = require('./dashboard.service');

exports.getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Error obteniendo dashboard" });
  }
};