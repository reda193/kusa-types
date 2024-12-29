const express = require('express');
const router = express.Router();
const userInfoController = require('../controllers/userInfoController');

router.get('/:userId', userInfoController.handleUserInfo); 

module.exports = router;