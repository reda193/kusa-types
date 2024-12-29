const User = require('../model/User');

async function addFields() {
    console.log('Work')

    try {
        await User.updateMany({}, {
            $set: {
                wpm_peak: 0,
                wpm_avg: [],
                total_games: 0,
                accuracy: [],
                isVerified: true,
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Work')
        const users = await User.find({});
        console.log('Updated users:', users);
    } catch (err) {
        console.error('Error:', err);
    }
}

module.exports = addFields;