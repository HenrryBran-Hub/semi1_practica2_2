const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');

const upload2 = multer();

const disktorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-semi1-' + file.originalname);
    }
})

const upload = multer({
    storage: disktorage
}).single('foto_perfil')

router.put('/editperfil', upload, profileController.editProfile);
router.get('/getperfil', upload2.none(),profileController.getPerfil);

module.exports = router;
