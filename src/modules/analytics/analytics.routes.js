const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

// Dashboard principal
router.get('/dashboard', dashboardController.getDashboard);

module.exports = router;