const User = require('../model/User');

const handleUserStats = async (req, res) => {
    try {
      const refreshToken = req.cookies.jwt;
      // Process and save gameStats to the database here
      const foundUser = await User.findOne({ refreshToken }).exec()
      const stats = req.body.gameStats;
      console.log();
    
      const oldWpm = foundUser.stats.wpm_peak;
      const newWpm = stats.wpm;
      console.log(stats);
      console.log(oldWpm);
      console.log(newWpm);
      // Accuray
      const accuracy = parseInt(stats.accuracy);
      console.log(accuracy);
    
      // Sets WPM
      if(newWpm > oldWpm) {
        const update = await User.updateOne(
            { username: foundUser.username }, // Filter by the user's unique identifier (e.g., _id)
            { $set: { "stats.wpm_peak": newWpm } } // Use $set to update only the `wpm_peak` field
        );  
      }
      
      // Sets WPM_AVG 
      const updateWPMAVG = await User.updateOne(
        { username: foundUser.username },
        { $push: { "stats.wpm_avg":  newWpm} }
      );
      
      // Incrmeents total_games
      const updateTOTALGAMES = await User.updateOne(
        { username: foundUser.username },
        { $inc: { "stats.total_games": 1 } }
    )

      const updateAccuracy = await User.updateOne(
        { username: foundUser.username },
        { $push: { "stats.accuracy": Number(accuracy) } }
    )
     
    
  



          res.status(200).json({ message: 'Game stats saved successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = { handleUserStats };