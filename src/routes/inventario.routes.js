import express from 'express';
import { listarStockAlmacen } from '../controllers/inventario.controller.js';

const router = express.Router();

// GET /api/inventario/almacen/:id_almacen
router.get('/almacen/:id_almacen', listarStockAlmacen);

export default router;