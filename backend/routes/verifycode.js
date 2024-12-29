const express = require('express');
const router = express.Router();
const verifyCodeController = require('../controllers/verifyCodeController');

router.post('/', verifyCodeController.verifyCodeController); 

module.exports = router;