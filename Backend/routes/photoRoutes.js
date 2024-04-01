const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const multer = require('multer');
const path = require('path');

const disktorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-semi1-' + file.originalname);
    }
});

const upload2 = multer();

const upload = multer({
    storage: disktorage
}).single('foto_album');

router.post('/loadphoto', upload, photoController.loadPhoto);
router.get('/watchphoto', upload2.none(), photoController.watchPhoto);
router.get('/getphotobyid', upload2.none(), photoController.getPhotoById);
router.post('/translate', upload2.none(), photoController.translateDescription);

module.exports = router;
