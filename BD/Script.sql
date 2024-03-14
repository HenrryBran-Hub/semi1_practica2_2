-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS FAUNADEX;

-- Usar la base de datos recién creada
USE FAUNADEX;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(32) NOT NULL, -- MD5 Hash
    foto_perfil VARCHAR(255) NOT NULL
);

-- Tabla de Álbumes
CREATE TABLE IF NOT EXISTS Album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_album VARCHAR(100) NOT NULL,
    id_usuario INT NOT NULL,
    estado BOOL NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- Tabla de Fotos
CREATE TABLE IF NOT EXISTS Foto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_foto VARCHAR(255) NOT NULL,
    url_foto VARCHAR(255) NOT NULL,
    id_album INT NOT NULL,
    estado BOOL NOT NULL,
    FOREIGN KEY (id_album) REFERENCES Album(id) ON DELETE CASCADE
);
