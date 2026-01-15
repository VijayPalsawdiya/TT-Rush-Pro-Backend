const statsService = require('./stats.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.getUserStats = async (req, res) => {
    try {
        const stats = await statsService.getUserStats(req.user.id);
        sendSuccess(res, stats, 'Stats fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};
