const User = require('../model/User')

const handleLogout =  async (req, res) => {
    // On client also delete the accessToken
    const cookies = req.cookies;
    console.log('Testing')
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;
    console.log('Raw headers:', req.headers);
    console.log('All cookies:', req.cookies);
    console.log('JWT cookie:', req.cookies?.jwt);
    console.log('Raw cookies:', req.headers.cookie);
    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204); // Success but no content
    }
    foundUser.refreshToken = null;
    const result = await foundUser.save();
    console.log(result);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout };