const mongoose = require('mongoose');

const matchChallengeSchema = new mongoose.Schema(
    {
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'expired'],
            default: 'pending',
        },
        message: {
            type: String,
        },
        isSingles: {
            type: Boolean,
            default: true,
        },
        partnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        accepterPartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
matchChallengeSchema.index({ fromUser: 1, toUser: 1, createdAt: -1 });
matchChallengeSchema.index({ toUser: 1, status: 1 });
matchChallengeSchema.index({ fromUser: 1, status: 1 });

module.exports = mongoose.model('MatchChallenge', matchChallengeSchema);
