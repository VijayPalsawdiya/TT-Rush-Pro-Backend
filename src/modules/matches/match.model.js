const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
    {
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge',
            required: true,
        },
        player1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending',
        },
        score: {
            player1Score: { type: Number, default: 0 },
            player2Score: { type: Number, default: 0 },
        },
        matchDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Match', matchSchema);
