const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        profilePicture: {
            type: String,
        },
        fcmToken: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        ranking: {
            type: Number,
            default: 0,
        },
        weeklyWins: {
            type: Number,
            default: 0,
        },
        weeklyLosses: {
            type: Number,
            default: 0,
        },
        totalWins: {
            type: Number,
            default: 0,
        },
        totalLosses: {
            type: Number,
            default: 0,
        },
        winPercentage: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
