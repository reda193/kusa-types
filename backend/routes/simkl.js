const express = require('express');
const router = express.Router();
const simklController = require('../controllers/simklController');


router.get('/recently-watched', simklController.handleRecentlyWatched);

module.exports = router;