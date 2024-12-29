const User = require('../model/User');

const handleUserInfo = async (req , res) => {
    const foundUser = await User.findOne({  _id: req.params.userId }).exec();
    if(!foundUser) return res.sendStatus(404);
    console.log(foundUser.stats.wpm_avg);
    res.status(201).json({
        username: foundUser.username,
        userId: foundUser._id,
        wpm_peak: foundUser.stats.wpm_peak,
        wpm_avg: foundUser.stats.wpm_avg,
        total_games: foundUser.stats.total_games,
        accuracy: foundUser.stats.accuracy
    });
};

module.exports = { handleUserInfo };