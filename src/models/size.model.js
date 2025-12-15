const db = require("../config/db");

const Size = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM sizes");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM sizes WHERE id_talla = ?", [id]);
    return rows[0];
  },

  create: async (nombre_talla) => {
    const [result] = await db.query(
      "INSERT INTO sizes (nombre_talla) VALUES (?)",
      [nombre_talla]
    );
    return { id_talla: result.insertId, nombre_talla };
  },

  update: async (id, nombre_talla) => {
    await db.query(
      "UPDATE sizes SET nombre_talla = ? WHERE id_talla = ?",
      [nombre_talla, id]
    );
    return { id_talla: id, nombre_talla };
  },

  delete: async (id) => {
    await db.query("DELETE FROM sizes WHERE id_talla = ?", [id]);
    return { message: `Talla con id ${id} eliminada` };
  },
};

module.exports = Size;
