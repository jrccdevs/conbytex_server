const db = require("../config/db");

const Color = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM color");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM color WHERE id_color = ?", [id]);
    return rows[0];
  },

  create: async (nombre_color) => {
    const [result] = await db.query(
      "INSERT INTO color (nombre_color) VALUES (?)",
      [nombre_color]
    );
    return { id_color: result.insertId, nombre_color };
  },

  update: async (id, nombre_color) => {
    await db.query(
      "UPDATE color SET nombre_color = ? WHERE id_color = ?",
      [nombre_color, id]
    );
    return { id_color: id, nombre_color };
  },

  delete: async (id) => {
    await db.query("DELETE FROM color WHERE id_color = ?", [id]);
    return { message: `Color con id ${id} eliminado` };
  },
};

module.exports = Color;
