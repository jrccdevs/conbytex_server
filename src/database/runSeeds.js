const seedPermissions = require("./seeds/permissions.seed");
const seedAdminPermissions = require("./seeds/admin.permissions.seed");
const seedAdminRole = require("./seeds/adminRole.seed");
const assignAdminRoleToUser  = require("./seeds/assignUserRole.seed");
const runSeeds = async () => {
  console.log("🚀 Ejecutando seeds...");
  await seedPermissions();      // 1. Crea permisos
  await seedAdminRole();        // 2. Crea rol admin
  await seedAdminPermissions(); // 3. Asigna permisos
  await assignAdminRoleToUser();
  console.log("🏁 Seeds completados");
  process.exit();
};

runSeeds();
