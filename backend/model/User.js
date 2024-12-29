const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    stats: {
        wpm_peak: {
            type: Number,
            default: 0
        },
        wpm_avg: {
            type: [Number],
            maxLength: 25,
            default: []
        },
        total_games: {
            type: Number,
            default: 0
        },
        accuracy: {
            type: [Number],
            maxLength: 25,
            default: []
        }
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    lastVerificationAttempt: {
        type: Date,
        default: null
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);