const userModel = require('../models/userModel');
const { verify } = require('jsonwebtoken');
const path = require('path');
const { uploadFileToS3 } = require('../s3Upload/uploadFileToS3');


exports.editProfile = async (req, res) => {

    try {
        const nombre_usuario = req.body.nombre_usuario;
        const nombre_completo = req.body.nombre_completo;
        const contrasena = req.body.contrasena;
        const foto_perfil = req.file && req.file.filename ? path.join(__dirname, '../images/' + req.file.filename) : null;
        const token = req.body.token;
        const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
        const id = decodedToken.id;

        // Verificar la contraseña 
        // Obtener el usuario por nombre de usuario
        const user = await userModel.getUserById(id);
        if (!user) {
            return res.status(500).json({ message: "Credenciales inválidas" });
        }
        
        // Compara las contraseñas
        if (compareMD5Values(contrasena, user.contrasena)) {
            // Verificamos si cambió la imagen 
            if (foto_perfil != null) {
                const fotoPerfilUrl = await uploadFileToS3(foto_perfil, 'Fotos_Perfil/');
                if (!fotoPerfilUrl) {
                    return res.status(500).json({ message: "Error al cargar la foto de perfil a S3" });
                }
                // Registrar el nuevo usuario
                const userId = await userModel.updateUserPhoto(id, fotoPerfilUrl.Location);
                if (userId.status === 200) {
                    console.log('estado del usuario:', userId.message);
                } else {
                    console.error('Hubo un problema al actualizar la foto:', userId.message);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }

                // obtenemos el id del album
                const albumId = await userModel.getAlbumIdByUserIdAndAlbumName(id, 'Perfil');
                if (userId.status === 200) {
                    console.log('estado del album:', albumId.message);
                } else {
                    console.error('Hubo un problema al guardar la foto:', albumId.message);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }

                // Registrar la foto en el album
                const fotoId = await userModel.savePhoto(fotoPerfilUrl.Key, fotoPerfilUrl.Location, albumId.id, '1');
                if (fotoId.status === 200) {
                    console.log('estado de la foto:', fotoId.message);
                } else {
                    console.error('Hubo un problema al guardar la foto:', fotoId.message);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }
            }
            // Verificamos si cambió el nombre completo
            if (nombre_completo != null && nombre_completo != '') {
                const nombrecompletoupdate = await userModel.updateUserNameComplete(id, nombre_completo);
                if (nombrecompletoupdate.status === 200) {
                    console.log('estado del usuario:', nombrecompletoupdate.message);
                } else {
                    console.error('Hubo un problema al actualizar el nombre:', nombrecompletoupdate.message);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }
            }
            // Verificamos si cambió el nombre de usuario
            if (nombre_usuario != null && nombre_usuario != '') {
                const usernameExists = await userModel.checkUsernameExists(nombre_usuario);
                if (usernameExists) {
                    return res.status(500).json({ message: "El nombre de usuario ya está en uso" });
                }
                const nombreusuario = await userModel.updateUserName(id, nombre_usuario);
                if (nombreusuario.status === 200) {
                    console.log('estado del usuario:', nombreusuario.message);
                } else {
                    console.error('Hubo un problema al actualizar el nombre de usuario:', nombreusuario.message);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }
            }
            // Autenticación exitosa
            return res.status(200).json({ status: 200, message: "Inicio de sesión exitoso" });
        } else {
            return res.status(500).json({ status: 500, message: "Contraseña no válida" });
        }
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};


//Funcion para obtener los datos del perfil
exports.getPerfil = async (req, res) => {
    // Obtener el ID del parámetro de consulta
    const token = req.query.id;
    const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
    const id = decodedToken.id;
    
    try {
        // Obtener el usuario por nombre de usuario
        const user = await userModel.getPerfilData(id);
        if (!user) {
            res.status(500).json({ status: 500, message: "Error en la petición" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al tomar los datos de usuario:", error);
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
};

function compareMD5Values(hashValue1, hashValue2) {
    return hashValue1 === hashValue2;
}