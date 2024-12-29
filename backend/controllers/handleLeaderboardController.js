const User = require('../model/User');

const handleLeaderboard = async (req, res) => {
    try {
        // Find all users and sort them by their peak WPM in descending order
        const leaderboard = await User.find({}, {
            username: 1,
            'stats.wpm_peak': 1,
            'stats.wpm_avg': 1,
            'stats.accuracy': 1,
            'stats.total_games': 1
        })
        .sort({ 'stats.wpm_peak': -1 }) // -1 for descending order
        .limit(100); // Limit to top 100 users

        // Calculate average WPM and accuracy for each user
        const formattedLeaderboard = leaderboard.map(user => {
            const avgWPM = user.stats.wpm_avg.length > 0 
                ? (user.stats.wpm_avg.reduce((a, b) => a + b, 0) / user.stats.wpm_avg.length).toFixed(1)
                : 0;

            const avgAccuracy = user.stats.accuracy.length > 0
                ? (user.stats.accuracy.reduce((a, b) => a + b, 0) / user.stats.accuracy.length).toFixed(1)
                : 0;

            return {
                username: user.username,
                peakWPM: user.stats.wpm_peak || 0,
                avgWPM: avgWPM,
                avgAccuracy: avgAccuracy,
                totalGames: user.stats.total_games || 0
            };
        });

        res.json(formattedLeaderboard);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ message: 'Failed to fetch leaderboard data' });
    }
};

module.exports = { handleLeaderboard };