const db = require('../database/connection');

// Función para cargar una nueva foto
exports.loadPhoto = async (url, userId, albumId, name) => {
    try {
        const [results, fields] = await db.execute('INSERT INTO photos (url, userId, albumId, name) VALUES (?, ?, ?, ?)', [url, userId, albumId, name]);
        return results.insertId; // Retorna el ID de la foto recién creada
    } catch (error) {
        throw error;
    }
};

// Función para verificar si una foto ya existe en un álbum de usuario
exports.checkPhotoExistsInAlbum = async (userId, albumId, name) => {
    try {
        const [results, fields] = await db.execute('SELECT * FROM photos WHERE userId = ? AND albumId = ? AND name = ?', [userId, albumId, name]);
        return results.length > 0; // Retorna true si la foto existe en el álbum del usuario, false si no
    } catch (error) {
        throw error;
    }
};

// Función para obtener todas las fotos de un álbum de usuario
exports.getPhotosByAlbumId = async (userId) => {
    try {//SELECT Album.nombre_album AS Album, Foto.nombre_foto AS Foto, Foto.url_foto AS URL, Foto.id as Id_foto
        const [results, fields] = await db.execute(`
        SELECT Album.nombre_album AS Album, Foto.nombre_foto AS Foto, Foto.url_foto AS URL, Foto.id as Id_foto
            FROM Album
            JOIN Foto ON Album.id = Foto.id_album
            WHERE Album.id_usuario = ?;
        `, [userId]);
        return results; // Retorna todos los álbumes y fotos del usuario
    } catch (error) {
        throw error;
    }
};


exports.getPhotoById = async (id) => {
    try {
        const [results, fields] = await db.execute(`
            SELECT id, nombre_foto, descripcion, url_foto, id_album, estado
            FROM Foto
            WHERE id = ?;
        `, [id]);
        return results; // Retorna todos los álbumes y fotos del usuario
    } catch (error) {
        throw error;
    }
};