const userModel = require('../models/userModel');
const { uploadFileToS3 } = require('../s3Upload/uploadFileToS3');
const jwt = require('jsonwebtoken');
const { serialize } = require('cookie');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {

        const nombre_usuario = req.body.nombre_usuario;
        const nombre_completo = req.body.nombre_completo;
        const contrasena = req.body.contrasena;
        const foto_perfil = path.join(__dirname, '../images/' + req.file.filename);

        // Verificar si el nombre de usuario ya está registrado
        const usernameExists = await userModel.checkUsernameExists(nombre_usuario);
        if (usernameExists) {
            return res.status(500).json({ message: "El nombre de usuario ya está en uso" });
        }

        const fotoPerfilUrl = await uploadFileToS3(foto_perfil,'Fotos_Perfil/');
        if (!fotoPerfilUrl) {
            res.status(500).json({ message: "Error al cargar la foto de perfil a S3" });
            throw new Error('Error al cargar la foto de perfil a S3');
        }

        // Registrar el nuevo usuario
        const userId = await userModel.createUser(nombre_usuario, nombre_completo, contrasena, fotoPerfilUrl.Location);
        if (userId.status === 200) {
            console.log('estado del album:', userId.message);
        } else {
            console.error('Hubo un problema al guardar la foto:', userId.message);
            res.status(500).json({ message: "Error interno del servidor" });
        }

        // Registrar el nuevo album
        const albumId = await userModel.createAlbum("Perfil", userId.id, '1');
        if (albumId.status === 200) {
            console.log('estado del album:', albumId.message);
        } else {
            console.error('Hubo un problema al guardar la foto:', albumId.message);
            res.status(500).json({ message: "Error interno del servidor" });
        }

        // Registrar la foto en el album
        const fotoId = await userModel.savePhoto(fotoPerfilUrl.Key, fotoPerfilUrl.Location, albumId.id, '1');
        if (fotoId.status === 200) {
            console.log('estado del album:', fotoId.message);
        } else {
            console.error('Hubo un problema al guardar la foto:', fotoId.message);
            res.status(500).json({ message: "Error interno del servidor" });
        }

        res.status(200).json({ message: 'Exito al ingresar los datos' });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
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
        bcrypt.compare(contrasena, user.contrasena, (err, result) => {
            if (err) {
                res.status(500).json({ status: 500, message: err });
                // Maneja el error apropiadamente
                return;
            }
            if (result) {
                // Creamos nuestro jwt
                const claveSecreta = process.env.JWT_KEY_SECRET_TOKEN;
                const token = jwt.sign({ 
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 *30,
                    id: user.id }, 
                    claveSecreta);

                res.status(200).json({ status: 200, message: "Inicio de sesión exitoso", token: token });
                // Aquí puedes generar un token JWT o realizar otras acciones
            } else {
                res.status(500).json({ status: 500, message: "Error interno del servidor" });
                // Puedes mostrar un mensaje de error al usuario
            }
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
};
