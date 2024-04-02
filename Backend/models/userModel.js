const db = require('../database/connection');

// Función para registrar un nuevo usuario
exports.createUser = async (nombre_usuario, nombre_completo, contrasena, foto_perfil) => {
    try {
        const [results, fields] = await db.execute('INSERT INTO Usuario (nombre_usuario, nombre_completo, contrasena, foto_perfil) VALUES (?, ?, ?, ?)', [nombre_usuario, nombre_completo, contrasena, foto_perfil]);
        if (results.affectedRows === 1) {
            // Si se insertó correctamente, retornar un estado 200
            return { status: 200, message: 'El usuario se guardó correctamente.', id: results.insertId };
        } else {
            // Si no se insertó correctamente, retornar un estado 500 con un mensaje de error
            return { status: 500, message: 'Hubo un problema al guardar la informacion de usuario.' };
        }
    } catch (error) {
        throw error;
    }
};

// Función para crear el nuevo album  de fotos en la base de datos cuando el usuairo se registra
exports.createAlbum = async (nombre_album, id_usuario, estado) => {
    try {
        const [results, fields] = await db.execute('INSERT INTO Album (nombre_album, id_usuario, estado) VALUES (?, ?, ?)', [nombre_album, id_usuario, estado]);
        if (results.affectedRows === 1) {
            // Si se insertó correctamente, retornar un estado 200
            return { status: 200, message: 'El album se creo correctamente.', id:results.insertId };
        } else {
            // Si no se insertó correctamente, retornar un estado 500 con un mensaje de error
            return { status: 500, message: 'Hubo un problema al crear el album.' };
        }
    } catch (error) {
        throw error;
    }
};

// Función para guardar la foto en el nuevo  album que acaba de ser creado
exports.savePhoto = async (nombre_foto, descripcion_foto, url_foto, id_album, estado) => {
    //exports.savePhoto = async (nombre_foto, url_foto, id_album, estado) => {
        try {
        const [results, fields] = await db.execute('INSERT INTO Foto (nombre_foto, descripcion, url_foto, id_album, estado) VALUES (?, ?, ?, ?, ?)', [nombre_foto, descripcion_foto, url_foto, id_album, estado]);
        //const [results, fields] = await db.execute('INSERT INTO Foto (nombre_foto, url_foto, id_album, estado) VALUES (?, ?, ?, ?)', [nombre_foto, url_foto, id_album, estado]);
        if (results.affectedRows === 1) {
            // Si se insertó correctamente, retornar un estado 200
            return { status: 200, message: 'La foto se guardó correctamente.' };
        } else {
            // Si no se insertó correctamente, retornar un estado 500 con un mensaje de error
            return { status: 500, message: 'Hubo un problema al guardar la foto.' };
        }
    } catch (error) {
        throw error;
    }
};

// Función para verificar si un nombre de usuario ya está registrado
exports.checkUsernameExists = async (nombre_usuario) => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM Usuario WHERE nombre_usuario = ?', [nombre_usuario]);
        return results.length > 0; // Retorna true si el nombre de usuario existe, false si no
    } catch (error) {
        throw error;
    }
};

// Función para obtener información de usuario por nombre de usuario y contraseña
exports.getUserById= async (id) => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM Usuario WHERE id = ?', [id]);
        return results[0]; // Retorna el primer usuario encontrado con el nombre de usuario y contraseña proporcionados
    } catch (error) {
        throw error;
    }
};

// Función para obtener información de usuario por nombre de usuario y contraseña
exports.getUserByUsername= async (name) => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM Usuario WHERE nombre_usuario = ?', [name]);
        return results[0]; // Retorna el primer usuario encontrado con el nombre de usuario y contraseña proporcionados
    } catch (error) {
        throw error;
    }
};

// Función para obtener información de usuario por nombre de usuario
exports.getPerfilData = async (id) => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM Usuario WHERE id = ?', [id]);
        return results[0]; // Retorna el primer usuario encontrado con el nombre de usuario y contraseña proporcionados
    } catch (error) {
        throw error;
    }
};

//Función para comparar nombre de usuario nombre de usuario y si es distinto actualizar
exports.getPerfilData = async (id) => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM Usuario WHERE id = ?', [id]);
        return results[0]; // Retorna el primer usuario encontrado con el nombre de usuario y contraseña proporcionados
    } catch (error) {
        throw error;
    }
};

// Función para registrar un nuevo usuario
exports.updateUserPhoto = async (id, foto_perfil) => {
    try {
        const [results, fields] = await db.execute('UPDATE Usuario SET foto_perfil = ? WHERE id = ?', [foto_perfil, id]);
        if (results.affectedRows === 1) {
            // Si se actualizó correctamente, retornar un estado 200
            return { status: 200, message: 'La foto de perfil del usuario se actualizó correctamente.' };
        } else {
            // Si no se actualizó correctamente (por ejemplo, si el usuario con el ID proporcionado no existe), retornar un estado 404 con un mensaje de error
            return { status: 404, message: 'El usuario con el ID proporcionado no fue encontrado.' };
        }
    } catch (error) {
        // Si se produce un error durante la ejecución de la consulta, lanzar el error para que pueda ser manejado por el código que llama a esta función
        throw error;
    }
};

// Función para obtener el ID del álbum del usuario
exports.getAlbumIdByUserIdAndAlbumName = async (userId, albumName) => {
    try {
        const [results, fields] = await db.execute('SELECT id FROM Album WHERE id_usuario = ? AND nombre_album = ?', [userId, albumName]);
        if (results.length > 0) {
            // Si se encontró un álbum con el nombre proporcionado para el usuario, devolver su ID
            return { status: 200, message: 'El usuario se guardó correctamente.', id: results[0].id };
        } else {
            // Si no se encontró ningún álbum con el nombre proporcionado para el usuario, lanzar un error
            return { status: 404, message: 'no se encontro el album para el usuario'};
        }
    } catch (error) {
        throw error;
    }
};

// Función para registrar un nuevo usuario
exports.updateUserNameComplete = async (id, nombre_completo) => {
    try {
        const [results, fields] = await db.execute('UPDATE Usuario SET nombre_completo = ? WHERE id = ?', [nombre_completo, id]);
        if (results.affectedRows === 1) {
            // Si se actualizó correctamente, retornar un estado 200
            return { status: 200, message: 'La foto de perfil del usuario se actualizó correctamente.' };
        } else {
            // Si no se actualizó correctamente (por ejemplo, si el usuario con el ID proporcionado no existe), retornar un estado 404 con un mensaje de error
            return { status: 404, message: 'El usuario con el ID proporcionado no fue encontrado.' };
        }
    } catch (error) {
        // Si se produce un error durante la ejecución de la consulta, lanzar el error para que pueda ser manejado por el código que llama a esta función
        throw error;
    }
};

// Función para registrar un nuevo usuario
exports.updateUserName = async (id, nombre_usuario) => {
    try {
        const [results, fields] = await db.execute('UPDATE Usuario SET nombre_usuario = ? WHERE id = ?', [nombre_usuario, id]);
        if (results.affectedRows === 1) {
            // Si se actualizó correctamente, retornar un estado 200
            return { status: 200, message: 'El nombre de usuario fue correctamente  actualizado y ahora es público.' };
        } else {
            // Si no se actualizó correctamente (por ejemplo, si el usuario con el ID proporcionado no existe), retornar un estado 404 con un mensaje de error
            return { status: 404, message: 'El usuario con el ID proporcionado no fue encontrado.' };
        }
    } catch (error) {
        // Si se produce un error durante la ejecución de la consulta, lanzar el error para que pueda ser manejado por el código que llama a esta función
        throw error;
    }
};

// Función para obtner todos los datos de usuario
exports.getUserGeneral = async() => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM Usuario');
        return results;
    } catch (error) {
        throw error;
    }
}