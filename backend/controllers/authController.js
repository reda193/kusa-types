const User = require('../model/User');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    console.log('work');
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized

    //Check if verified
    if(!foundUser.isVerified) return res.status(400).json({'message': 'Please verify your email.'});
    
    // Evaluate password

    const match = await bcrypt.compare(password, foundUser.password);
    console.log(match)
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            { 
                "UserInfo": { 
                    "username": foundUser.username,
                    "roles": roles
                } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '180s' }
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ 
            accessToken,
            success: 'Logged in',
            userId: foundUser._id 
        });
    } else {
        res.sendStatus(401);
    }

}

module.exports = { handleLogin };