const Producto = require("../models/producto.model");

exports.getProductos = async (req, res) => {
  try {
    const productos = await Producto.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};
exports.getProductosConReceta = async (req, res) => {
  try {
    const productos = await Producto.getConReceta();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener productos con receta", 
      error 
    });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

exports.createProducto = async (req, res) => {
  try {
    const required = ["nombre_producto", "tipo_producto", "id_material", "id_unidadmedida"];
    for (const field of required) {
      if (!req.body[field]) return res.status(400).json({ message: `${field} es obligatorio` });
    }

    const newProducto = await Producto.create(req.body);
    res.json({ message: "Producto creado", producto: newProducto });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const updatedProducto = await Producto.update(req.params.id, req.body);
    res.json({ message: "Producto actualizado", producto: updatedProducto });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const result = await Producto.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};
