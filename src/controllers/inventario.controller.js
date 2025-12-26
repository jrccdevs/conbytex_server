const Inventario = require("../models/inventario.model");

const inventarioController = {
    listarStockAlmacen: async (req, res) => {
        const { id_almacen } = req.params;
        try {
            const stock = await Inventario.obtenerStockPorAlmacen(id_almacen);
            res.status(200).json(stock);
        } catch (error) {
            console.error("Error en inventarioController:", error);
            res.status(500).json({ 
                mensaje: "Error al obtener el stock del almacén",
                error: error.message 
            });
        }
    }
};

module.exports = inventarioController;