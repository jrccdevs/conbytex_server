const express = require('express');
const cors = require('cors');
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
// 🔹 Middleware
app.use(cors({
  origin:[ 'http://localhost:5173', FRONTEND_URL ], // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// 🔹 Rutas
const routes = require('./routes');
app.use('/api', routes);

module.exports = app;
