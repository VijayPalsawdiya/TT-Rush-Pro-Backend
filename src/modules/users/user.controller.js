const userService = require('./user.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        sendSuccess(res, user, 'Profile fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await userService.updateUser(req.user.id, req.body);
        sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.updateFCMToken = async (req, res) => {
    try {
        await userService.updateFCMToken(req.user.id, req.body.fcmToken);
        sendSuccess(res, null, 'FCM token updated successfully');
    } catch (error) {
        sendError(res, error);
    }
};
