const nodemailer = require('nodemailer');
require('dotenv').config();

// Store codes with expiry (in production, use Redis or database instead of Map)
const verificationCodes = new Map();

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeVerificationCode(email, code) {
    const expiryTime = Date.now() + 15 * 60 * 1000; // Current time + 15 minutes
    verificationCodes.set(email, {
        code,
        expiresAt: expiryTime
    });
}

function verifyCode(email, code) {
    const storedData = verificationCodes.get(email);
    if (!storedData) return { valid: false, message: 'No verification code found' };
    
    if (Date.now() > storedData.expiresAt) {
        verificationCodes.delete(email);
        return { valid: false, message: 'Code expired' };
    }
    
    if (code !== storedData.code) {
        return { valid: false, message: 'Invalid code' };
    }
    
    verificationCodes.delete(email); // Remove after successful verification
    return { valid: true, message: 'Code verified successfully' };
}

const sendVerificationEmail = async (userEmail) => {
    const code = generateVerificationCode();
    storeVerificationCode(userEmail, code);
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.zohocloud.ca',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PW
        }
    });

    const mailOptions = {
        from: 'noreply@kusatypes.com',
        to: userEmail,
        subject: 'Your KusaTypes Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Email Verification</h1>
                <p>Your verification code is:</p>
                <h2 style="font-size: 32px; letter-spacing: 5px; background-color: #f5f5f5; padding: 20px; text-align: center;">${code}</h2>
                <p>This code will expire in 15 minutes.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail, verifyCode };