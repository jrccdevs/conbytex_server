const db = require("../config/db");

const Unidad = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM unidadesmedida");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM unidadesmedida WHERE id_unidad = ?", [id]);
    return rows[0];
  },

  create: async (nombre_unidad) => {
    const [result] = await db.query(
      "INSERT INTO unidadesmedida (nombre_unidad) VALUES (?)",
      [nombre_unidad]
    );
    return { id_unidad: result.insertId, nombre_unidad };
  },

  update: async (id, nombre_unidad) => {
    await db.query(
      "UPDATE unidadesmedida SET nombre_unidad = ? WHERE id_unidad = ?",
      [nombre_unidad, id]
    );
    return { id_unidad: id, nombre_unidad };
  },

  delete: async (id) => {
    await db.query("DELETE FROM unidadesmedida WHERE id_unidad = ?", [id]);
    return { message: `Unidad con id ${id} eliminada` };
  },
};

module.exports = Unidad;
