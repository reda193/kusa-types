const express = require('express');
const router = express.Router();
const handleLeaderboardController = require('../controllers/handleLeaderboardController')
router.get('/', handleLeaderboardController.handleLeaderboard); 

module.exports = router;