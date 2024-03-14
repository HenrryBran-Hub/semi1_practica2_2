const photoModel = require('../models/photoModel');
const userModel = require('../models/userModel');
const { verify } = require('jsonwebtoken');
const path = require('path');
const { uploadFileToS3 } = require('../s3Upload/uploadFileToS3');

exports.loadPhoto = async (req, res) => {
    try {
        const nombre_foto = req.body.nombre_foto;
        const nombre_album = req.body.nombre_album;
        const foto_album = req.file && req.file.filename ? path.join(__dirname, '../images/' + req.file.filename) : null;
        const token = req.body.Token;
        const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
        const id = decodedToken.id;

        console.log(foto_album);

        // Verificamos si cambió la imagen 
        if (foto_album != null) {
            const fotoPerfilUrl = await uploadFileToS3(foto_album, 'fotos_publicadas/');
            if (!fotoPerfilUrl) {
                return res.status(500).json({ message: "Error al cargar la foto de album a S3" });
            }

            // obtenemos el id del album
            const albumId = await userModel.getAlbumIdByUserIdAndAlbumName(id, nombre_album);
            if (albumId.status === 200) {
                console.log('estado del album:', albumId.message);
            } else {
                console.error('Hubo un problema al guardar la foto:', albumId.message);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            // Registrar la foto en el album
            const fotoId = await userModel.savePhoto(nombre_foto, fotoPerfilUrl.Location, albumId.id, '1');
            if (fotoId.status === 200) {
                console.log('estado de la foto:', fotoId.message);
            } else {
                console.error('Hubo un problema al guardar la foto:', fotoId.message);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            // Autenticación exitosa
            return res.status(200).json({ status: 200, message: "Se subio la foto al album correctamente" });
        } else {
            return res.status(500).json({ status: 500, message: "Contraseña no válida" });
        }
    } catch (error) {
        console.error("Error al cargar foto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.watchPhoto = async (req, res) => {
    try {
        const token = req.query.id;
        const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
        const id = decodedToken.id;

        // Obtener todas las fotos del álbum del usuario
        const photos = await photoModel.getPhotosByAlbumId(id);
        res.status(200).json({ photos });
    } catch (error) {
        console.error("Error al ver fotos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
