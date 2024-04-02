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

const upload2 = multer();

router.post('/signup', upload, authController.signup);
router.post('/login', upload, authController.login);
router.post('/loginfoto', upload, authController.loginFoto);
router.get('/descriptionuser', upload2.none(), authController.getPerfilDescription);
router.post('/descriptiongeneral', upload2.none(), authController.getDescriptionGeneral);


module.exports = router;
