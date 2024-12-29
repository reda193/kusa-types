const User = require('../model/User');
const validator = require('validator');

const { sendVerificationEmail } = require('../config/verificationEmail');


const verifyCodeController = async (req, res) => {
    const { email } = req.body;
    
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Valid email required' });
    }
 
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });
 
    if (user.isVerified) {
        return res.status(400).json({ message: 'Email already verified' });
    }
     if (user.lastVerificationAttempt) {
        const timeSinceLastAttempt = Date.now() - user.lastVerificationAttempt;
        const fifteenMinutes = 15 * 60 * 1000;
 
        if (timeSinceLastAttempt < fifteenMinutes) {
            const timeLeft = Math.ceil((fifteenMinutes - timeSinceLastAttempt) / 60000);
            return res.status(429).json({ 
                message: `Please wait ${timeLeft} minutes before requesting a new code`
            });
        }
    }
 
    try {
        await sendVerificationEmail(email);
        await User.updateOne(
            { email }, 
            { lastVerificationAttempt: Date.now() }
        );
        res.json({ message: 'New verification code sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
 };

module.exports = { verifyCodeController };