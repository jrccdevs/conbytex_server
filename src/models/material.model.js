const db = require("../config/db");

const Material = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM materiales");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM materiales WHERE id_material = ?", [id]);
    return rows[0];
  },

  create: async (nombre_material) => {
    const [result] = await db.query(
      "INSERT INTO materiales (nombre_material) VALUES (?)",
      [nombre_material]
    );
    return { id_material: result.insertId, nombre_material };
  },

  update: async (id, nombre_material) => {
    await db.query(
      "UPDATE materiales SET nombre_material = ? WHERE id_material = ?",
      [nombre_material, id]
    );
    return { id_material: id, nombre_material };
  },

  delete: async (id) => {
    await db.query("DELETE FROM materiales WHERE id_material = ?", [id]);
    return { message: `Material con id ${id} eliminado` };
  },
};

module.exports = Material;
