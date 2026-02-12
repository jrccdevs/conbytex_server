const bcrypt = require('bcryptjs');
const db = require('../config/db');
const User = require('../models/user.model');

/**
 * Crear usuario (ADMIN)
 * Asigna uno o varios roles
 */
exports.createUser = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { name, email, password } = req.body;

    // ✅ SOLO validar campos del usuario
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    // 1️⃣ Crear usuario
    const [result] = await connection.query(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user_id: result.insertId
    });

  } catch (error) {
    await connection.rollback();
    console.error('CREATE USER ERROR:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  } finally {
    connection.release();
  }
};
exports.updateUser = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const { name, email, status, password } = req.body;

    // 1. Verificar si el email ya existe para otro usuario
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    let query = 'UPDATE users SET name = ?, email = ?, status = ?';
    let params = [name, email, status];

    // 2. Si viene una contraseña nueva, la hasheamos y la añadimos al query
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await connection.query(query, params);

    res.json({ message: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error('UPDATE USER ERROR:', error);
    res.status(500).json({ message: 'Error al actualizar datos del usuario' });
  } finally {
    connection.release();
  }
};
/**
 * Obtener todos los usuarios (ADMIN)
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers(); 
    // Asegúrate de que User.getAllUsers() use el nuevo query que incluye la tabla user_permissions
    res.json(users);
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

/**
 * Actualizar roles de usuario
 */
exports.updateUserRoles = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const { role_ids } = req.body;

    if (!role_ids || role_ids.length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un rol' });
    }

    await connection.beginTransaction();

    // 1️⃣ Eliminar roles actuales
    await connection.query(
      `DELETE FROM user_roles WHERE user_id = ?`,
      [id]
    );

    // 2️⃣ Asignar nuevos roles
    const values = role_ids.map(roleId => [id, roleId]);
    await connection.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES ?`,
      [values]
    );

    await connection.commit();

    res.json({ message: 'Roles actualizados correctamente' });

  } catch (error) {
    await connection.rollback();
    console.error('UPDATE USER ROLES ERROR:', error);
    res.status(500).json({ message: 'Error al actualizar roles' });
  } finally {
    connection.release();
  }
};

/**
 * Eliminar usuario
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.deleteUser(id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
exports.updateUserPermissions = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const { role_id, permission_ids } = req.body; // 💡 Verifica que el nombre coincida con el front

    await connection.beginTransaction();

    // 1️⃣ Actualizar el ROL
    // Borramos cualquier rol previo
    await connection.query('DELETE FROM user_roles WHERE user_id = ?', [id]);
    
    // Insertamos el nuevo rol si existe
    if (role_id) {
      await connection.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', 
        [id, role_id]
      );
    }

    // 2️⃣ Actualizar Permisos Directos
    await connection.query('DELETE FROM user_permissions WHERE user_id = ?', [id]);
    if (permission_ids && permission_ids.length > 0) {
      const values = permission_ids.map(pId => [id, pId]);
      await connection.query(
        'INSERT INTO user_permissions (user_id, permission_id) VALUES ?',
        [values]
      );
    }

    await connection.commit();
    res.json({ message: 'Seguridad actualizada' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error' });
  } finally {
    connection.release();
  }
};
/**
 * Obtener un usuario por ID (para edición)
 */
exports.getUserById = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;

    // 1️⃣ Obtener datos básicos del usuario
    const [users] = await connection.query(
      'SELECT id, name, email, status FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = users[0];

    // 2️⃣ Obtener roles asignados
    const [roles] = await connection.query(
      `SELECT r.id, r.name 
       FROM roles r 
       INNER JOIN user_roles ur ON ur.role_id = r.id 
       WHERE ur.user_id = ?`,
      [id]
    );

    user.roles = roles;
    user.role_id = roles.length > 0 ? roles[0].id : null; // Solo el primero, como usa el frontend

    // 3️⃣ Obtener permisos directos asignados
    const [permissions] = await connection.query(
      `SELECT permission_id FROM user_permissions WHERE user_id = ?`,
      [id]
    );

    user.direct_permission_ids = permissions.map(p => p.permission_id);

    res.json(user);

  } catch (error) {
    console.error('GET USER BY ID ERROR:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  } finally {
    connection.release();
  }
};