const db = require('../config/db');
// ARCHIVO QUE NO ESTA FUNCIONADO SSE DEBE ELIMINAR
// 1. Obtener lista de roles con sus permisos (IDs y Nombres)
exports.getRoles = async (req, res) => {
    try {
        const [roles] = await db.query(`
            SELECT 
                r.*, 
                GROUP_CONCAT(p.name) as permission_names, 
                GROUP_CONCAT(p.id) as permission_ids
            FROM roles r
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            GROUP BY r.id
            ORDER BY r.name ASC
        `);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener roles', error: error.message });
    }
};

// 2. Obtener catálogo de todos los permisos disponibles para los switches
exports.getPermissionsList = async (req, res) => {
    try {
        const [permissions] = await db.query('SELECT * FROM permissions ORDER BY name ASC');
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener lista de permisos', error: error.message });
    }
};

// 3. Crear Rol y asociar sus permisos base
exports.createRole = async (req, res) => {
    const { name, description, permissionIds } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [roleRes] = await conn.query(
            'INSERT INTO roles (name, description) VALUES (?, ?)', 
            [name, description]
        );
        const roleId = roleRes.insertId;

        if (permissionIds && permissionIds.length > 0) {
            const values = permissionIds.map(pId => [roleId, pId]);
            await conn.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ?', [values]);
        }

        await conn.commit();
        res.status(201).json({ msg: 'Rol creado exitosamente', roleId });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ msg: 'Error al crear rol', error: error.message });
    } finally {
        conn.release();
    }
};

// 4. Actualizar Rol (Nombre, Descripción y refrescar permisos)
exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { name, description, permissionIds } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Actualizar datos básicos
        await conn.query(
            'UPDATE roles SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );

        // Sincronizar permisos: Borramos los actuales e insertamos los nuevos
        await conn.query('DELETE FROM role_permissions WHERE role_id = ?', [id]);

        if (permissionIds && permissionIds.length > 0) {
            const values = permissionIds.map(pId => [id, pId]);
            await conn.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ?', [values]);
        }

        await conn.commit();
        res.json({ msg: 'Rol actualizado correctamente' });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ msg: 'Error al actualizar rol', error: error.message });
    } finally {
        conn.release();
    }
};

// 5. Eliminar Rol
exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        // La tabla role_permissions tiene ON DELETE CASCADE, así que se limpian solos
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }

        res.json({ msg: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar rol', error: error.message });
    }
};