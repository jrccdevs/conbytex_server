const db = require("../../config/db");

const seedAdminRole = async () => {
  const connection = await db.getConnection();

  try {
    const [[role]] = await connection.query(
      `SELECT id FROM roles WHERE slug = 'admin'`
    );

    if (!role) {
      console.log("Creando rol admin...");
      const [result] = await connection.query(
        `INSERT INTO roles (name, slug) VALUES ('Admin', 'admin')`
      );

      const roleId = result.insertId;

      const [permissions] = await connection.query(
        `SELECT id FROM permissions`
      );

      const values = permissions.map(p => [roleId, p.id]);

      await connection.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ?`,
        [values]
      );
    }

    console.log("✅ Rol admin listo");
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
};

module.exports = seedAdminRole;
