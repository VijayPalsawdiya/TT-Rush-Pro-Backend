const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['rank', 'weekly'],
            required: true,
        },
        minRank: {
            type: Number,
        },
        maxRank: {
            type: Number,
        },
        weekNumber: {
            type: Number,
        },
        year: {
            type: Number,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Challenge', challengeSchema);
