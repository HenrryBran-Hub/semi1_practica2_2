const { Token } = require('aws-sdk');
const albumModel = require('../models/albumModel');
const { verify } = require('jsonwebtoken');

exports.editAlbum = async (req, res) => {
    try {
        const token = req.body.Token;
        const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
        const id = decodedToken.id;
        const nombre_viejo = req.body.nombre_album;
        const nombre_nuevo = req.body.nombre_album_nuevo;

        const estado = await albumModel.verifyAlbumNew(id, nombre_nuevo);
        if (!estado) {
            const album = await albumModel.updateAlbum(id, nombre_viejo, nombre_nuevo);
            if (!album) {
                res.status(500).json({ status: 500, message: "Error en la petición" });
            } else {
                res.status(200).json({ status: 200, message: "Se actualizo el album correctamente" });
            }
        } else {
            res.status(500).json({ status: 500, message: "Error en la petición" });
        }
    } catch (error) {
        console.error("Error al crear álbum:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getAlbum = async (req, res) => {
    const token = req.query.id;
    const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
    const id = decodedToken.id;
    try {
        // Obtener el usuario por nombre de usuario
        const album = await albumModel.getAlbumByIdUser(id);
        if (!album) {
            res.status(500).json({ status: 500, message: "Error en la petición" });
        } else {
            res.status(200).json(album);
        }
    } catch (error) {
        console.error("Error al tomar los datos de usuario:", error);
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
};

exports.newAlbum = async (req, res) => {
    const token = req.body.Token;
    const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
    const id = decodedToken.id;
    const nombre = req.body.nombre_album;
    try {
        // Obtener el usuario por nombre de usuario
        const estado = await albumModel.verifyAlbumNew(id, nombre);
        if (!estado) {
            const album = await albumModel.createAlbum(id, nombre);
            if (!album) {
                res.status(500).json({ status: 500, message: "Error en la petición" });
            } else {
                res.status(200).json({ status: 200, message: "Se creo el album correctamente" });
            }
        } else {
            res.status(500).json({ status: 500, message: "Error en la petición" });
        }
    } catch (error) {
        console.error("Error al tomar los datos de usuario:", error);
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        const token = req.body.Token;
        const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
        const id = decodedToken.id;
        const nombre = req.body.nombre_album;
        //eliminar las fotos relacionadas a el album
        const estado = await albumModel.deleteFotoAlbum(id, nombre);
        if (estado) {
            const album = await albumModel.deleteAlbum(id, nombre);
            if (album) {
                res.status(200).json({ status: 200, message: "Se elimino el album" });
            } else {
                res.status(500).json({ status: 500, message: "Error en la petición" });
            }
        } else {
            res.status(500).json({ status: 500, message: "Error en la petición" }); F
        }
    } catch (error) {
        console.error("Error al tomar los datos de usuario:", error);
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
};