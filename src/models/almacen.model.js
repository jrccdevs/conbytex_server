const db = require("../config/db");

const Almacen = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM almacenes");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM almacenes WHERE id_almacen = ?", [id]);
    return rows[0];
  },

  create: async (nombre_almacen) => {
    const [result] = await db.query(
      "INSERT INTO almacenes (nombre_almacen) VALUES (?)",
      [nombre_almacen]
    );
    return { id_almacen: result.insertId, nombre_almacen };
  },

  update: async (id, nombre_almacen) => {
    await db.query(
      "UPDATE almacenes SET nombre_almacen = ? WHERE id_almacen = ?",
      [nombre_almacen, id]
    );
    return { id_almacen: id, nombre_almacen };
  },

  delete: async (id) => {
    await db.query("DELETE FROM almacenes WHERE id_almacen = ?", [id]);
    return { message: `Almacén con id ${id} eliminado` };
  },
};

module.exports = Almacen;
