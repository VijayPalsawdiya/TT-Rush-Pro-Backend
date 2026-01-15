// Auth controller
const authService = require('./auth.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const result = await authService.googleLogin(token);
        sendSuccess(res, result, 'Login successful');
    } catch (error) {
        sendError(res, error);
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.logout = async (req, res) => {
    try {
        await authService.logout(req.user.id);
        sendSuccess(res, null, 'Logout successful');
    } catch (error) {
        sendError(res, error);
    }
};
