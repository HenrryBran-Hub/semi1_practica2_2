const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

const disktorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-semi1-' + file.originalname);
    }
})

const upload = multer({
    storage: disktorage
}).single('foto_perfil')

router.post('/signup', upload, authController.signup);
router.post('/login', upload, authController.login);

module.exports = router;
