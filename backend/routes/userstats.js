const express = require('express');
const router = express.Router();
const posetStatsController = require('../controllers/postStatsController');

router.post('/', posetStatsController.handleUserStats); 

module.exports = router;