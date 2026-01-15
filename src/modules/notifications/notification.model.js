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
        body: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['match_invite', 'match_result', 'challenge_update', 'general'],
            required: true,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);
