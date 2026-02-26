const db = require("../config/db");

const Cliente = {

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM clientes");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const {
      codigo_cliente,
      nombre,
      email,
      telefono,
      tipo_documento,
      numero_documento,
      direccion,
      estado = 1
    } = data;

    // 🔹 Validar código único
    const [codigoExiste] = await db.query(
      "SELECT id_cliente FROM clientes WHERE codigo_cliente = ?",
      [codigo_cliente]
    );
    if (codigoExiste.length > 0) {
      throw new Error("El código de cliente ya existe");
    }

    // 🔹 Validar documento único
    const [docExiste] = await db.query(
      "SELECT id_cliente FROM clientes WHERE numero_documento = ?",
      [numero_documento]
    );
    if (docExiste.length > 0) {
      throw new Error("El número de documento ya está registrado");
    }

    const [result] = await db.query(
      `INSERT INTO clientes 
      (codigo_cliente, nombre, email, telefono, tipo_documento, numero_documento, direccion, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo_cliente,
        nombre,
        email,
        telefono,
        tipo_documento,
        numero_documento,
        direccion,
        estado
      ]
    );

    return { id_cliente: result.insertId, ...data };
  },

  update: async (id, data) => {
    const {
      codigo_cliente,
      nombre,
      email,
      telefono,
      tipo_documento,
      numero_documento,
      direccion,
      estado = 1
    } = data;

    // 🔹 Validar código único (excepto el actual)
    const [codigoExiste] = await db.query(
      "SELECT id_cliente FROM clientes WHERE codigo_cliente = ? AND id_cliente != ?",
      [codigo_cliente, id]
    );
    if (codigoExiste.length > 0) {
      throw new Error("El código de cliente ya existe");
    }

    // 🔹 Validar documento único (excepto el actual)
    const [docExiste] = await db.query(
      "SELECT id_cliente FROM clientes WHERE numero_documento = ? AND id_cliente != ?",
      [numero_documento, id]
    );
    if (docExiste.length > 0) {
      throw new Error("El número de documento ya está registrado");
    }

    await db.query(
      `UPDATE clientes SET
        codigo_cliente = ?,
        nombre = ?,
        email = ?,
        telefono = ?,
        tipo_documento = ?,
        numero_documento = ?,
        direccion = ?,
        estado = ?
       WHERE id_cliente = ?`,
      [
        codigo_cliente,
        nombre,
        email,
        telefono,
        tipo_documento,
        numero_documento,
        direccion,
        estado,
        id
      ]
    );

    return { id_cliente: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM clientes WHERE id_cliente = ?", [id]);
    return { message: `Cliente con id ${id} eliminado` };
  }
};

module.exports = Cliente;