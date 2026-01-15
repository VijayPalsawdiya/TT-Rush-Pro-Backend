const notificationService = require('./notification.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotifications(req.user.id);
        sendSuccess(res, notifications, 'Notifications fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id);
        sendSuccess(res, null, 'Notification marked as read');
    } catch (error) {
        sendError(res, error);
    }
};

exports.sendNotification = async (req, res) => {
    try {
        await notificationService.sendNotification(req.body);
        sendSuccess(res, null, 'Notification sent successfully');
    } catch (error) {
        sendError(res, error);
    }
};
