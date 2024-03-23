const userModel = require('../models/userModel');
const { uploadFileToS3 } = require('../s3Upload/uploadFileToS3');
const rekognition = require('../database/loginFoto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const axios = require('axios');
const { Base64 } = require('js-base64');
const s3 = require("../database/s3config");
const { verify } = require('jsonwebtoken');


exports.signup = async (req, res) => {
    try {

        const nombre_usuario = req.body.nombre_usuario;
        const nombre_completo = req.body.nombre_completo;
        const contrasena = req.body.contrasena;
        const foto_perfil = path.join(__dirname, '../images/' + req.file.filename);

        // Verificar si el nombre de usuario ya está registrado
        const usernameExists = await userModel.checkUsernameExists(nombre_usuario);
        if (usernameExists) {
            return res.status(500).json({ message: "El nombre de usuario ya está en uso en Registro" });
        }

        const fotoPerfilUrl = await uploadFileToS3(foto_perfil, 'Fotos_Perfil/');
        if (!fotoPerfilUrl) {
            res.status(500).json({ message: "Error al cargar la foto de perfil a S3" });
            throw new Error('Error al cargar la foto de perfil a S3');
        }

        // Registrar el nuevo usuario
        const userId = await userModel.createUser(nombre_usuario, nombre_completo, contrasena, fotoPerfilUrl.Location);
        if (userId.status === 200) {
            console.log('estado del usuario:', userId.message);
        } else {
            console.error('Hubo un problema al guardar la foto:', userId.message);
            res.status(500).json({ message: "Error interno del servido en el registro" });
        }

        // Registrar el nuevo album
        const albumId = await userModel.createAlbum("Perfil", userId.id, '1');
        if (albumId.status === 200) {
            console.log('estado del album en el registro:', albumId.message);
        } else {
            console.error('Hubo un problema al guardar la foto en el registro:', albumId.message);
            res.status(500).json({ message: "Error interno del servidor en el registro" });
        }

        // Registrar la foto en el album
        const fotoId = await userModel.savePhoto(fotoPerfilUrl.Key, fotoPerfilUrl.Location, albumId.id, '1');
        if (fotoId.status === 200) {
            console.log('estado de la foto en el registro:', fotoId.message);
        } else {
            console.error('Hubo un problema al guardar la foto en el registro:', fotoId.message);
            res.status(500).json({ message: "Error interno del servidor en el registro" });
        }

        return res.status(200).json({ message: 'Exito al ingresar los datos usuario registrado' });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor en el registro" });
    }
};

exports.login = async (req, res) => {
    const nombre_usuario = req.body.nombre_usuario;
    const contrasena = req.body.contrasena;
    try {

        // Obtener el usuario por nombre de usuario
        const user = await userModel.getUserByUsername(nombre_usuario);
        if (!user) {
            return res.status(500).json({ message: "Credenciales inválidas" });
        }
        // Compara las contraseñas
        if (compareMD5Values(contrasena, user.contrasena)) {
            // Creamos nuestro jwt
            const claveSecreta = process.env.JWT_KEY_SECRET_TOKEN;
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    id: user.id
                },
                claveSecreta);

            console.log(token);

            return res.status(200).json({ status: 200, message: "Inicio de sesión exitoso por contraseña", token: token });
        } else {
            return res.status(500).json({ status: 500, message: "Error interno del servidor por contraseña" });
        }
    } catch (error) {
        console.error("Error al iniciar sesión por contraseña:", error);
        return res.status(500).json({ status: 500, message: "Error interno del servidor por contraseña" });
    }
};

function compareMD5Values(hashValue1, hashValue2) {
    return hashValue1 === hashValue2;
}

exports.loginFoto = async (req, res) => {
    try {
        // Obtener el usuario por nombre de usuario
        const users = await userModel.getUserGeneral();

        const imagen1Base64 = req.body.imagen_base64;
        const parts = imagen1Base64.split(',');
        const imageBase64 = parts[1];

        let authenticated = false;
        let userId;

        for (const user of users) {

            console.log("MOSTRAMOS LOS  USUARIOS");
            console.log(user.foto_perfil);
            const salida = await getBase64(user.foto_perfil);
            const similitud = await compararImagenes(salida, imageBase64);
            console.log('Porcentaje de similitud:', similitud);
            if (similitud >= 90) {
                authenticated = true;
                userId = user.id;
                break;
            }
        }

        if (authenticated) {
            // Creamos nuestro jwt
            const claveSecreta = process.env.JWT_KEY_SECRET_TOKEN;
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                id: userId
            }, claveSecreta);

            res.status(200).json({ status: 200, message: "Inicio de sesión exitoso por foto", token: token });
        } else {
            res.status(500).json({ status: 500, message: "Error interno del servidor en login por foto" });
        }
    } catch (error) {
        console.error("Error al iniciar sesión con foto:", error);
        res.status(500).json({ message: "Error interno del servidor en el login por foto" });
    }
};

// Función para convertir una imagen desde una URL en Base64
async function getBase64(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Base64.fromUint8Array(new Uint8Array(response.data));
    return base64;
};

// Función para comparar imágenes
async function compararImagenes(imagen1Base64, imagen2Base64) {

    const params = {
        SimilarityThreshold: 90,
        SourceImage: {
            Bytes: Buffer.from(imagen1Base64, 'base64')
        },
        TargetImage: {
            Bytes: Buffer.from(imagen2Base64, 'base64')
        }
    };

    try {
        const resultado = await rekognition.compareFaces(params).promise();
        if (resultado.FaceMatches.length > 0) {
            return resultado.FaceMatches[0].Similarity;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error al comparar imágenes:', error);
        throw error;
    }
}

//Funcion para obtener los datos del perfil
exports.getPerfilDescription = async (req, res) => {
    // Obtener el ID del parámetro de consulta
    const token = req.query.id;
    console.log(token);
    const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
    const id = decodedToken.id;

    try {
        // Obtener el usuario por nombre de usuario
        const user = await userModel.getPerfilData(id);
        if (!user) {
            res.status(500).json({ status: 500, message: "Error en la petición" });
        } else {
            const salida = await getBase64(user.foto_perfil);
            const descripcion = await analizarImagenEnRekognition(salida);
            res.status(200).json(descripcion);
        }
    } catch (error) {
        console.error("Error al tomar los datos de usuario:", error);
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
};


async function analizarImagenEnRekognition(base64Image) {
    const params = {
        Image: {
            Bytes: Buffer.from(base64Image, 'base64')
        },
        MaxLabels: 30,
        MinConfidence: 50
    };

    try {
        const response = await rekognition.detectLabels(params).promise();

        // Crear un array para almacenar los datos de cada etiqueta
        let labelsData = [];

        // Iterar sobre cada etiqueta en la respuesta y crear un objeto JSON para cada una
        response.Labels.forEach((label, index) => {
            let labelData = {
                nombre: label.Name,
                confianza: Math.round(label.Confidence)
            };
            labelsData.push(labelData);
        });

        // Retornar el array de objetos JSON
        return labelsData;
    } catch (error) {
        console.log(error);
        return "No se pudo analizar la imagen.";
    }
}

exports.getDescriptionGeneral = async (req, res) => {
    // Obtener el ID del parámetro de consulta
    const imagen = req.body.base64Image;

    try {

        const descripcion = await analizarImagenEnRekognition(imagen);
        res.status(200).json(descripcion);

    } catch (error) {
        console.error("Error al tomar los datos de usuario:", error);
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
};
