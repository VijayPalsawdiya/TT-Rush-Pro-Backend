const Notification = require('./notification.model');
const User = require('../users/user.model');
const admin = require('../../config/firebase');

exports.getNotifications = async (userId) => {
    return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
};

exports.markAsRead = async (notificationId) => {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
};

exports.sendNotification = async (notificationData) => {
    const { userId, title, body, type, data } = notificationData;

    // Save notification to database
    await Notification.create({
        userId,
        title,
        body,
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
