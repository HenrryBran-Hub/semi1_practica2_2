const fs = require('fs');
const s3 = require("../database/s3config");
const mime = require('mime-types');
const path = require('path');

const uploadFileToS3 = async (filePath,directorio) => {
  try {
    const fileContent = fs.createReadStream(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const folder = directorio; // Nombre de la carpeta dentro del bucket
    const fileName = `perfil-${Date.now()}${extension}`; // Nombre único para el archivo en S3
    const key = folder + fileName; // Ruta completa del archivo en S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key, // Define un nombre único para el archivo en S3
      Body: fileContent,
      ContentType: mime.lookup(extension)
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          eliminarArchivo(filePath);
          resolve(data); // Retorna la URL del archivo cargado en S3
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

function eliminarArchivo(rutaArchivo) {
  fs.unlink(rutaArchivo, (error) => {
    if (error) {
      console.error('Error al intentar eliminar el archivo en el registro:', error);
      return;
    }
    console.log('El archivo ha sido eliminado correctamente en el registro.');
  });
}

module.exports = { uploadFileToS3 };
