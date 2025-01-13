// controllers/simklController.js
const axios = require('axios');

const handleRecentlyWatched = async (req, res) => {
    try {
        console.log('SIMKL API Request Started');
        
        const url = `https://api.simkl.com/users/recently-watched-background/${process.env.USER_ID}${process.env.SIMKL_API_KEY}`;
        const params = {
            client_id: process.env.SIMKL_API_KEY
        };

        console.log('Making request to:', url);
        const response = await axios.get(url, { params });
        
        if (!response.data) {
            return res.status(404).json({ message: 'No data received from SIMKL' });
        }

        res.json(response.data);

    } catch (err) {
        console.error('SIMKL Error:', err.response?.data || err);
        res.status(500).json({ message: 'Failed to fetch SIMKL data' });
    }
};

module.exports = { handleRecentlyWatched };