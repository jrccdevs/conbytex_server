const db = require("../../config/db");

const seedAdminPermissions = async () => {
  const connection = await db.getConnection();

  try {
    console.log("🌱 Asignando permisos al rol ADMIN...");

    // 1️⃣ Obtener rol admin
    const [[adminRole]] = await connection.query(
      `SELECT id FROM roles WHERE slug = 'admin' LIMIT 1`
    );

    if (!adminRole) {
      throw new Error("❌ El rol admin no existe");
    }

    const adminRoleId = adminRole.id;

    // 2️⃣ Obtener todos los permisos
    const [permissions] = await connection.query(
      `SELECT id FROM permissions`
    );

    if (permissions.length === 0) {
      console.log("⚠️ No hay permisos para asignar");
      return;
    }

    // 3️⃣ Preparar valores
    const values = permissions.map(p => [adminRoleId, p.id]);

    // 4️⃣ Insertar sin duplicar
    await connection.query(
      `INSERT IGNORE INTO role_permissions (role_id, permission_id)
       VALUES ?`,
      [values]
    );

    console.log(`✅ ${permissions.length} permisos asignados al admin`);
  } catch (error) {
    console.error("❌ Error seed admin permissions:", error.message);
  } finally {
    connection.release();
  }
};

module.exports = seedAdminPermissions;
