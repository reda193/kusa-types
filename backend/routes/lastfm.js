const express = require('express');
const router = express.Router();
const lastfmController = require('../controllers/lastfmController');

router.get('/recent-tracks', lastfmController.handleLastFM);
router.get('/top-albums/:period', lastfmController.handleTopAlbums);
router.get('/top-artists/:period', lastfmController.handleTopArtists);
router.get('/top-tracks/:period', lastfmController.handleTopTracks);
module.exports = router;