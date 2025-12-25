const Orden = require("../models/orden.model");

const Receta = require("../models/receta.model");
const db = require("../config/db"); // Importamos db para usar transacciones
exports.updateOrden = async (req, res) => {
  const connection = await db.getConnection();
  try {
      const { id_producto, id_empleado, cantidad_solicitada, estado } = req.body;
      const id_orden = req.params.id;

      const ordenAnterior = await Orden.getById(id_orden);
      if (!ordenAnterior) return res.status(404).json({ message: "Orden no encontrada" });

      const estadoAnterior = ordenAnterior.estado;
      const cantidad = cantidad_solicitada;

      await connection.beginTransaction();

      // --- LÓGICA DE TRANSICIÓN: PENDIENTE -> EN PROCESO ---
      if (estadoAnterior === 'pendiente' && estado === 'en proceso') {
          const insumos = await Receta.getByProducto(id_producto);
          
          for (const item of insumos) {
              const totalReserva = item.cantidad * cantidad;
              
              // 1. Consultar usando tus nombres de columna exactos: stock y stock_reservado
              const [prod] = await connection.query(
                  "SELECT stock, stock_reservado FROM productos WHERE id_producto = ?", 
                  [item.id_producto_material]
              );

              if (prod.length === 0) throw new Error(`El material con ID ${item.id_producto_material} no existe.`);

              // 2. Manejar posibles valores NULL con || 0
              const stockFisico = parseFloat(prod[0].stock) || 0;
              const reservadoActual = parseFloat(prod[0].stock_reservado) || 0;
              const disponible = stockFisico - reservadoActual;

              if (disponible < totalReserva) {
                  throw new Error(`Stock insuficiente para material ID ${item.id_producto_material}. Disponible: ${disponible}, Necesario: ${totalReserva}`);
              }

              // 3. Actualizar la reserva
              await connection.query(
                  "UPDATE productos SET stock_reservado = stock_reservado + ? WHERE id_producto = ?",
                  [totalReserva, item.id_producto_material]
              );
          }
      }

      // --- LÓGICA DE TRANSICIÓN: EN PROCESO -> COMPLETADA ---
      else if (estadoAnterior === 'en proceso' && estado === 'completada') {
          const insumos = await Receta.getByProducto(id_producto);
          for (const item of insumos) {
              const totalAConsumir = item.cantidad * cantidad;
              // Restar del stock físico y liberar la reserva
              await connection.query(
                  "UPDATE productos SET stock = stock - ?, stock_reservado = stock_reservado - ? WHERE id_producto = ?",
                  [totalAConsumir, totalAConsumir, item.id_producto_material]
              );
          }
          // Sumar el Producto Terminado resultante al stock
          await connection.query(
              "UPDATE productos SET stock = stock + ? WHERE id_producto = ?",
              [cantidad, id_producto]
          );
      }
      const updatedOrden = await Orden.update(
        id_orden, 
        { id_producto, id_empleado, cantidad_solicitada, estado },
        connection // <--- IMPORTANTE: Pasa la conexión aquí
    );
    
    await connection.commit();
    res.json({ message: `Orden actualizada a ${estado}`, orden: updatedOrden });
  } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: error.message || "Error al actualizar", error });
  } finally {
      connection.release();
  }
};

exports.getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.getAll();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener órdenes", error });
  }
};

exports.getOrdenById = async (req, res) => {
  try {
    const orden = await Orden.getById(req.params.id);
    if (!orden) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden", error });
  }
};

exports.createOrden = async (req, res) => {
  try {
    const { id_producto, id_empleado, cantidad_solicitada } = req.body;
    if (!id_producto || !id_empleado || !cantidad_solicitada)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const newOrden = await Orden.create({ id_producto, id_empleado, cantidad_solicitada });
    res.json({ message: "Orden creada", orden: newOrden });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error });
  }
};



exports.deleteOrden = async (req, res) => {
  try {
    const result = await Orden.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
};
