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

  create: async (data) => {
    const {
      codigo,
      nombre_empleado,
      email,
      telefono,
      direccion,
      fecha_nacimiento,
      cargo,
      activo = true,
      id_usuario = null
    } = data;

    // 🔥 Validar código único
    const [existe] = await db.query(
      "SELECT id_empleado FROM empleados WHERE codigo = ?",
      [codigo]
    );

    if (existe.length > 0) {
      throw new Error("El código de empleado ya existe");
    }

    const [result] = await db.query(
      `INSERT INTO empleados 
      (codigo, nombre_empleado, email, telefono, direccion, fecha_nacimiento, cargo, activo, id_usuario) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo,
        nombre_empleado,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        cargo,
        activo,
        id_usuario
      ]
    );

    return { id_empleado: result.insertId, ...data };
  },

  update: async (id, data) => {
    const {
      codigo,
      nombre_empleado,
      email,
      telefono,
      direccion,
      fecha_nacimiento,
      cargo,
      activo = true,
      id_usuario = null
    } = data;

    // 🔥 Validar código único (excepto el mismo empleado)
    const [existe] = await db.query(
      "SELECT id_empleado FROM empleados WHERE codigo = ? AND id_empleado != ?",
      [codigo, id]
    );

    if (existe.length > 0) {
      throw new Error("El código de empleado ya existe");
    }

    await db.query(
      `UPDATE empleados SET 
        codigo = ?, 
        nombre_empleado = ?, 
        email = ?, 
        telefono = ?, 
        direccion = ?, 
        fecha_nacimiento = ?, 
        cargo = ?, 
        activo = ?, 
        id_usuario = ?
       WHERE id_empleado = ?`,
      [
        codigo,
        nombre_empleado,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        cargo,
        activo,
        id_usuario,
        id
      ]
    );

    return { id_empleado: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM empleados WHERE id_empleado = ?", [id]);
    return { message: `Empleado con id ${id} eliminado` };
  },
};

module.exports = Empleado;