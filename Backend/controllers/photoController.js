const photoModel = require('../models/photoModel');
const userModel = require('../models/userModel');
const { verify } = require('jsonwebtoken');
const path = require('path');
const { uploadFileToS3 } = require('../s3Upload/uploadFileToS3');
const { toUsTranslate } = require('../s3Upload/awsFn');
const {getTagRekognition} = require('../rekognition/rekognition')


let albumId=null;
exports.loadPhoto = async (req, res) => {
    try {
        const nombre_foto = req.body.nombre_foto;
        const descripcion_foto = req.body.descripcion_foto;
        const foto_album = req.file && req.file.filename ? path.join(__dirname, '../images/' + req.file.filename) : null;
        const token = req.body.Token;
        const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
        const id = decodedToken.id;
        
        console.log(foto_album);

        // Verificamos si cambió la imagen 
        if (foto_album != null) {
            const fotoPerfilUrl = await uploadFileToS3(foto_album, 'fotos_publicadas/');
            //console.log('FOTOOOOOOOOOOOOO --------------------:::',fotoPerfilUrl.key);
            //const fotoPerfilUrlBucket = fotoPerfilUrl.toString().slice(33);
            if (!fotoPerfilUrl) {
                return res.status(500).json({ message: "Error al cargar la foto de album a S3" });
            }

            const nombre_album = await getTagRekognition(fotoPerfilUrl.key);

            // obtenemos el id del album
            albumId = await userModel.getAlbumIdByUserIdAndAlbumName(id, nombre_album[0].Etiqueta);

            if (albumId.status === 200) {
                console.log('estado del album:', albumId.message);
            } else {
                const answerCreacionAlbum = await userModel.createAlbum(nombre_album[0].Etiqueta, id, '1'); // BORRAR
                if (answerCreacionAlbum.status==200) albumId=answerCreacionAlbum;
                else{
                    console.error('Hubo un problema al guardar la foto:', albumId.message);
                    return res.status(500).json({ message: "Error interno del servidor" });

                }
            }

            // Registrar la foto en el album
            const fotoId = await userModel.savePhoto(nombre_foto, descripcion_foto, fotoPerfilUrl.Location, albumId.id, '1');
            //const fotoId = await userModel.savePhoto(nombre_foto, fotoPerfilUrl.Location, albumId.id, '1');
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

exports.getPhotoById = async (req, res) => {
    try {
        const id = req.query.id;

        // Obtener todas las fotos del álbum del usuario
        const photos = await photoModel.getPhotoById(id);
        res.status(200).json(photos);
    } catch (error) {
        console.error("Error al ver fotos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.translateDescription = async (req, res) => {
    try {
        const id = req.query.id;
        const { descripcion } = req.body;

        const txtResult = await toUsTranslate(id, descripcion);
        if (!txtResult) {
            return res.status(500).json({ message: "Error al traducir el texto" });
        }
        return res.status(200).json(txtResult);
    } catch (error) {
        console.error("Error al ver fotos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};