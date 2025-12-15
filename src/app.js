const express = require('express');
const cors = require('cors');
const app = express();

// 🔹 Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// 🔹 Rutas
const routes = require('./routes');
app.use('/api', routes);

module.exports = app;
