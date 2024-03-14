const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const multer = require('multer');

const upload2 = multer();

router.post('/editalbum', upload2.none(),albumController.editAlbum);
router.get('/getalbum', upload2.none(),albumController.getAlbum);
router.post('/recordalbum', upload2.none(),albumController.newAlbum);
router.post('/deletealbum', upload2.none(),albumController.deleteAlbum);

module.exports = router;
