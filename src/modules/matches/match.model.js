const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
    {
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MatchChallenge',
        },
        isSingles: {
            type: Boolean,
            default: true,
        },
        // For singles matches
        player1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        // For doubles matches
        team1Player1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        team1Player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        team2Player1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        team2Player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
