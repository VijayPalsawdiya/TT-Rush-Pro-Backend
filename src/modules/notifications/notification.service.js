const Notification = require('./notification.model');
const User = require('../users/user.model');
const admin = require('../../config/firebase');

exports.getNotifications = async (userId) => {
    return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
};

exports.markAsRead = async (notificationId) => {
    await Notification.findByIdAndUpdate(notificationId, { read: true });
};

/**
 * Create a notification (for match challenges)
 */
exports.createNotification = async (notificationData) => {
    const { userId, type, title, message, relatedId } = notificationData;

    // Save notification to database
    const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        relatedId,
    });

    // Emit socket event for real-time update
    try {
        const { emitToUser } = require('../../socket');
        emitToUser(userId, 'notification:new', notification);
    } catch (error) {
        console.warn('Socket emit failed:', error.message);
    }

    // Send FCM notification
    const user = await User.findById(userId);

    if (user && user.fcmToken) {
        const fcmMessage = {
            notification: {
                title,
                body: message,
            },
            data: {
                type,
                relatedId: relatedId?.toString() || '',
            },
            token: user.fcmToken,
        };

        try {
            await admin.messaging().send(fcmMessage);
        } catch (error) {
            console.error('FCM send error:', error);
        }
    }

    return notification;
};

/**
 * Send notification (legacy method)
 */
exports.sendNotification = async (notificationData) => {
    const { userId, title, body, type, data } = notificationData;

    // Save notification to database
    await Notification.create({
        userId,
        title,
        message: body,
        type,
        data,
    });

    // Send FCM notification
    const user = await User.findById(userId);

    if (user && user.fcmToken) {
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            token: user.fcmToken,
        };

        try {
            await admin.messaging().send(message);
        } catch (error) {
            console.error('FCM send error:', error);
        }
    }
};
