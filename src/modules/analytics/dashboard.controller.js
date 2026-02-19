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

// Dejamos placeholders para lo siguiente
exports.getKpis = async (req, res) => {
  res.json({ message: "KPIs próximamente" });
};

exports.getAlerts = async (req, res) => {
  res.json({ message: "Alertas próximamente" });
};

exports.getTrends = async (req, res) => {
  res.json({ message: "Tendencias próximamente" });
};

exports.getForecast = async (req, res) => {
  res.json({ message: "Forecast próximamente" });
};
