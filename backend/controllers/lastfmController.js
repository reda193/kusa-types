const User = require('../model/User');
const axios = require('axios');

const handleLastFM = async (req, res) => {
    try {
        console.log('LastFM API Request Started');
        console.log('Environment variables:', {
            user: process.env.LASTFM_USER,
            api_key: process.env.LASTFM_API_KEY
        });

        const url = 'https://ws.audioscrobbler.com/2.0/';
        const params = {
            method: 'user.getRecentTracks',
            user: process.env.LASTFM_USER,
            api_key: process.env.LASTFM_API_KEY,
            format: 'json',
            limit: 1
        };

        console.log('Making request to:', url, 'with params:', params);
        const response = await axios.get(url, { params });
        
        if (!response.data) {
            return res.status(404).json({ message: 'No data received from LastFM' });
        }

        res.json(response.data);

    } catch (err) {
        console.error('LastFM Error:', err.response?.data || err);
        res.status(500).json({ message: 'Failed to fetch LastFM data' });
    }
}

const handleTopAlbums = async (req, res) => {
    try {
        const { period } = req.params;
        console.log(req.params);
        console.log('TopAlbums Request for period:', period);

        const url = 'https://ws.audioscrobbler.com/2.0/';
        const params = {
            method: 'user.gettopalbums',
            user: process.env.LASTFM_USER,
            api_key: process.env.LASTFM_API_KEY,
            period: period,
            format: 'json',
            limit: 10
        };

        const response = await axios.get(url, { params });
        
        if (!response.data) {
            return res.status(404).json({ message: 'No album data received' });
        }

        res.json(response.data);

    } catch (err) {
        console.error('TopAlbums Error:', err.response?.data || err);
        res.status(500).json({ message: 'Failed to fetch top albums' });
    }
}

const handleTopTracks = async (req, res) => {
    try {
        const { period } = req.params;
        console.log('TopTracks Request for period:', period);

        const url = 'https://ws.audioscrobbler.com/2.0/';
        const params = {
            method: 'user.gettoptracks',
            user: process.env.LASTFM_USER,
            api_key: process.env.LASTFM_API_KEY,
            period: period,
            format: 'json',
            limit: 10
        };

        const response = await axios.get(url, { params });
        
        if (!response.data) {
            return res.status(404).json({ message: 'No track data received' });
        }

        res.json(response.data);

    } catch (err) {
        console.error('TopTracks Error:', err.response?.data || err);
        res.status(500).json({ message: 'Failed to fetch top tracks' });
    }
}

const handleTopArtists = async (req, res) => {
    try {
        const { period } = req.params;
        console.log('TopArtists Request for period:', period);

        const url = 'https://ws.audioscrobbler.com/2.0/';
        const params = {
            method: 'user.gettopartists',
            user: process.env.LASTFM_USER,
            api_key: process.env.LASTFM_API_KEY,
            period: period,
            format: 'json',
            limit: 10
        };

        const response = await axios.get(url, { params });
        
        if (!response.data) {
            return res.status(404).json({ message: 'No artist data received' });
        }

        res.json(response.data);

    } catch (err) {
        console.error('TopArtists Error:', err.response?.data || err);
        res.status(500).json({ message: 'Failed to fetch top artists' });
    }
}

module.exports = { handleLastFM, handleTopAlbums, handleTopTracks, handleTopArtists };