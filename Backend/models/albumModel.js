const db = require('../database/connection');

// Función para registrar un nuevo álbum
exports.createAlbum = async (id_usuario,nombre_album) => {
    try {
        const [results, fields] = await db.execute('INSERT INTO Album (nombre_album, id_usuario, estado) VALUES (?, ?, ?)', [nombre_album, id_usuario, '1']);
        return results.insertId; // Retorna el ID del álbum recién creado
    } catch (error) {
        throw error;
    }
};

// Función para verificar si un álbum ya existe para un usuario
exports.getAlbumByIdUser = async (userId) => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM Album WHERE id_usuario = ? AND nombre_album <> ?', [userId, 'Perfil']);
        return results; // Retorna las filas de álbumes excepto aquellos con nombre "Perfil"
    } catch (error) {
        throw error;
    }
};

// Función para editar un álbum
exports.editAlbum = async (albumId, newName, userId,) => {
    try {
        const [results, fields] = await db.execute('UPDATE Album SET name = ? WHERE id = ? AND userId = ?', [newName, albumId, userId]);
        return results.affectedRows > 0; // Retorna true si se actualizó el álbum, false si no
    } catch (error) {
        throw error;
    }
};

// Función para eliminar un álbum
exports.verifyAlbumNew = async (id_usuario,nombre_album,) => {
    try {
        const [results, fields] = await db.execute('SELECT *FROM Album WHERE id_usuario = ? AND nombre_album = ?', [id_usuario, nombre_album]);
        return results.affectedRows > 0; // Retorna true si se existe el álbum, false si no
    } catch (error) {
        throw error;
    }
};

//Todos los datos de un album
exports.verifyAlbumNew = async (id_usuario,nombre_album,) => {
    try {
        const [results, fields] = await db.execute('SELECT *FROM Album WHERE id_usuario = ? AND nombre_album = ?', [id_usuario, nombre_album]);
        return results // Retorna true si se existe el álbum, false si no
    } catch (error) {
        throw error;
    }
};

// Función para eliminar un álbum
exports.deleteFotoAlbum = async (id_usuario,nombre_album,) => {
    try {
        const [results, fields] = await db.execute('DELETE FROM Foto WHERE id_album = (SELECT id FROM Album WHERE id_usuario = ? AND nombre_album = ?)', [id_usuario, nombre_album]);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.deleteAlbum = async (id_usuario,nombre_album,) => {
    try {
        const [results, fields] = await db.execute('DELETE FROM Album WHERE id_usuario = ? AND nombre_album = ?', [id_usuario, nombre_album]);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.updateAlbum = async (id, nombre_viejo, nombre_nuevo,) => {
    try {
        const [results, fields] = await db.execute('UPDATE Album SET nombre_album = ? WHERE id_usuario = ? AND nombre_album = ?', [nombre_nuevo, id, nombre_viejo]);
        return results.affectedRows > 0; // Retorna true si se actualizó el álbum, false si no
    } catch (error) {
        throw error;
    }
};
