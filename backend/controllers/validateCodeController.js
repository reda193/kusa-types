const User = require('../model/User');
const validator = require('validator');

const { verifyCode } = require('../config/verificationEmail');

const validateCodeController = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Valid email required' });
    }
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).json({ message: 'User not found '});

    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - user.lastVerificationAttempt > fifteenMinutes) {
        return res.status(400).json({ 
            message: 'Verification code has expired. Please request a new one.'
        });
    }
    
    const result = verifyCode(email, code);
    if (!result.valid) {
        return res.status(400).json({ message: result.message });
    }

    try {
        await User.updateOne({ email }, { isVerified: true });
        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { validateCodeController };