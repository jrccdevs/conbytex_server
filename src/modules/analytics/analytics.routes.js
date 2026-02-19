const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

// Resumen general
router.get('/summary', dashboardController.getSummary);
// Dashboard principal
// Dashboard principal
router.get('/dashboard', dashboardController.getDashboard);

// KPIs
router.get('/kpis', dashboardController.getKpis);

// Alertas
router.get('/alerts', dashboardController.getAlerts);

// Tendencias
router.get('/trends', dashboardController.getTrends);

// Forecast
router.get('/forecast', dashboardController.getForecast);

module.exports = router;
