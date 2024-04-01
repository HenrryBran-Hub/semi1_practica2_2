const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');


router.post('/sendMessage', botController.sendMessage);


module.exports = router;
