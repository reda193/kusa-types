const User = require('../model/User');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { sendVerificationEmail, verifyCode } = require('../config/verificationEmail');
const { v4: uuidv4 } = require("uuid");

const handleNewUser = async (req, res) => {
    const { user, email, pwd } = req.body;
    if (!user || !pwd || !email) return res.status(400).json({ 'message': 'Username, password, and email are required.' });

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const duplicate = await User.findOne({ 
        $or: [{ username: user }, { email: email }]
    }).exec();
    
    if(duplicate) {
        const isDuplicateUsername = duplicate.username === user;
        const isDuplicateEmail = duplicate.email === email;
        if(isDuplicateEmail && isDuplicateEmail) return res.status(409).json({ message : 'Username and Email already exist'});
        return res.status(409).json({
            message : isDuplicateUsername ? 'Username already exists' : 'Email already exists'
        }); 
    } 

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const result = await User.create({ 
            "username": user, 
            "email": email,
            "password": hashedPwd,
            "isVerified": false,
            "lastVerificationAttempt": Date.now()
        });

        await sendVerificationEmail(email);
        
        res.status(201).json({ 
            'success': `User ${user} created! Please check your email for verification code.`,
            'userId': result._id 
        });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const handleVerification = async (req, res) => {
    const { email, code } = req.body;
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

module.exports = { handleNewUser, handleVerification };