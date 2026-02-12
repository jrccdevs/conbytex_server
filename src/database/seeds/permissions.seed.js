const db = require("../../config/db");

const permissions = [
  // USERS
  { name: "Ver usuarios", slug: "users.view" },
  { name: "Crear usuarios", slug: "users.create" },
  { name: "Editar usuarios", slug: "users.edit" },
  { name: "Eliminar usuarios", slug: "users.delete" },

  // ROLES
  { name: "Ver roles", slug: "roles.view" },
  { name: "Crear roles", slug: "roles.create" },
  { name: "Editar roles", slug: "roles.edit" },
  { name: "Eliminar roles", slug: "roles.delete" },
  { name: "Asignar permisos", slug: "roles.assign_permissions" },

  // PRODUCTS
  { name: "Ver productos", slug: "productos.view" },
  { name: "Crear productos", slug: "productos.create" },
  { name: "Editar productos", slug: "productos.edit" },
  { name: "Eliminar productos", slug: "productos.delete" },


   // ALMACEN
   { name: "Ver almacen", slug: "almacen.view" },
   { name: "Crear almacen", slug: "almacen.create" },
   { name: "Editar almacen", slug: "almacen.edit" },
   { name: "Eliminar almacen", slug: "almacen.delete" },

   // COLOR
   { name: "Ver color", slug: "color.view" },
   { name: "Crear color", slug: "color.create" },
   { name: "Editar color", slug: "color.edit" },
   { name: "Eliminar color", slug: "color.delete" },

    // EMPLEADOS
    { name: "Ver empleados", slug: "empleados.view" },
    { name: "Crear empleados", slug: "empleados.create" },
    { name: "Editar empleados", slug: "empleados.edit" },
    { name: "Eliminar empleados", slug: "empleados.delete" },

     // INVENTARIO
   { name: "Ver inventario", slug: "inventario.view" },
   { name: "Crear inventario", slug: "inventario.create" },
   { name: "Editar inventario", slug: "inventario.edit" },
   { name: "Eliminar inventario", slug: "inventario.delete" },

   // MATERIAL
   { name: "Ver material", slug: "material.view" },
   { name: "Crear material", slug: "material.create" },
   { name: "Editar material", slug: "material.edit" },
   { name: "Eliminar material", slug: "material.delete" },

   // MOVIMIENTOS
   { name: "Ver movimientos", slug: "movimientos.view" },
   { name: "Crear movimientos", slug: "movimientos.create" },
   { name: "Editar movimientos", slug: "movimientos.edit" },
   { name: "Eliminar movimientos", slug: "movimientos.delete" },

   // ORDEN-CONSUMO
   { name: "Ver orden-consumo", slug: "ordenconsumo.view" },
   { name: "Crear orden-consumo", slug: "ordenconsumo.create" },
   { name: "Editar orden-consumo", slug: "ordenconsumo.edit" },
   { name: "Eliminar orden-consumo", slug: "ordenconsumo.delete" },

    //ORDEN
   { name: "Ver orden", slug: "orden.view" },
   { name: "Crear orden", slug: "orden.create" },
   { name: "Editar orden", slug: "orden.edit" },
   { name: "Eliminar orden", slug: "orden.delete" },

    //RECETA
   { name: "Ver receta", slug: "recetas.view" },
   { name: "Crear receta", slug: "recetas.create" },
   { name: "Editar receta", slug: "recetas.edit" },
   { name: "Eliminar receta", slug: "recetas.delete" },

   
    //TALLA-SIZE
   { name: "Ver talla", slug: "size.view" },
   { name: "Crear talla", slug: "size.create" },
   { name: "Editar talla", slug: "size.edit" },
   { name: "Eliminar talla", slug: "size.delete" },
   
    //UNIDAD
   { name: "Ver unidad", slug: "unidad.view" },
   { name: "Crear unidad", slug: "unidad.create" },
   { name: "Editar unidad", slug: "unidad.edit" },
   { name: "Eliminar unidad", slug: "unidad.delete" },

];

const seedPermissions = async () => {
  const connection = await db.getConnection();

  try {
    console.log("🌱 Insertando permisos...");

    for (const permission of permissions) {
      await connection.query(
        `INSERT IGNORE INTO permissions (name, slug)
         VALUES (?, ?)`,
        [permission.name, permission.slug]
      );
    }

    console.log("✅ Permisos insertados correctamente");
  } catch (error) {
    console.error("❌ Error en seed permissions:", error);
  } finally {
    connection.release();
  }
};

module.exports = seedPermissions;
