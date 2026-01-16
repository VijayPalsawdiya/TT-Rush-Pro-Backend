const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                'match_invite',
                'match_result',
                'challenge_update',
                'challenge-received',
                'challenge-sent',
                'challenge-accepted',
                'challenge-rejected',
                'general'
            ],
            required: true,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);
