const Material = require("../models/material.model");

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.getAll();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener materiales", error });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.getById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material no encontrado" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el material", error });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { nombre_material } = req.body;
    if (!nombre_material) return res.status(400).json({ message: "nombre_material es obligatorio" });

    const newMaterial = await Material.create(nombre_material);
    res.json({ message: "Material creado", material: newMaterial });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el material", error });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { nombre_material } = req.body;
    if (!nombre_material) return res.status(400).json({ message: "nombre_material es obligatorio" });

    const updatedMaterial = await Material.update(req.params.id, nombre_material);
    res.json({ message: "Material actualizado", material: updatedMaterial });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el material", error });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const result = await Material.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el material", error });
  }
};
