const express = require('express');
const router = express.Router();
const validateCodeController = require('../controllers/validateCodeController')

router.post('/', validateCodeController.validateCodeController); 

module.exports = router;