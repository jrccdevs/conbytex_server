import Inventario from '../models/inventario.model.js';

export const listarStockAlmacen = async (req, res) => {
    const { id_almacen } = req.params;
    try {
        const stock = await Inventario.obtenerStockPorAlmacen(id_almacen);
        res.status(200).json(stock);
    } catch (error) {
        console.error('Error en controlador de inventario:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener el stock del almacén',
            error: error.message 
        });
    }
};