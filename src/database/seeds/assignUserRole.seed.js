const db = require("../../config/db");

const assignAdminRoleToUser = async () => {
  const connection = await db.getConnection();

  try {
    console.log("🌱 Asignando rol ADMIN a admin@gmail.com...");

    // 1️⃣ Buscar usuario
    const [[user]] = await connection.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      ["admin@gmail.com"]
    );

    if (!user) {
      console.log("❌ Usuario admin@gmail.com no existe");
      return;
    }

    // 2️⃣ Buscar rol admin
    const [[role]] = await connection.query(
      `SELECT id FROM roles WHERE slug = 'admin' LIMIT 1`
    );

    if (!role) {
      console.log("❌ Rol admin no existe");
      return;
    }

    // 3️⃣ Insertar relación sin duplicar
    await connection.query(
      `INSERT IGNORE INTO user_roles (user_id, role_id)
       VALUES (?, ?)`,
      [user.id, role.id]
    );

    console.log("✅ Rol admin asignado correctamente al usuario");

  } catch (error) {
    console.error("❌ Error asignando rol:", error.message);
  } finally {
    connection.release();
  }
};

module.exports = assignAdminRoleToUser;
