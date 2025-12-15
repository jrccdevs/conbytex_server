const db = require("../config/db");

const Empleado = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM empleados");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM empleados WHERE id_empleado = ?",
      [id]
    );
    return rows[0];
  },

  create: async (nombre_empleado, cargo, activo = true, id_usuario = null) => {
    const [result] = await db.query(
      "INSERT INTO empleados (nombre_empleado, cargo, activo, id_usuario) VALUES (?, ?, ?, ?)",
      [nombre_empleado, cargo, activo, id_usuario]
    );

    return {
      id_empleado: result.insertId,
      nombre_empleado,
      cargo,
      activo,
      id_usuario,
    };
  },

  update: async (id, nombre_empleado, cargo, activo = true, id_usuario = null) => {
    await db.query(
      "UPDATE empleados SET nombre_empleado = ?, cargo = ?, activo = ?, id_usuario = ? WHERE id_empleado = ?",
      [nombre_empleado, cargo, activo, id_usuario, id]
    );

    return {
      id_empleado: id,
      nombre_empleado,
      cargo,
      activo,
      id_usuario,
    };
  },

  delete: async (id) => {
    await db.query("DELETE FROM empleados WHERE id_empleado = ?", [id]);
    return { message: `Empleado con id ${id} eliminado` };
  },
};

module.exports = Empleado;
