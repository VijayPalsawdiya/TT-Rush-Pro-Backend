const leaderboardService = require('./leaderboard.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await leaderboardService.getLeaderboard(req.query);
        sendSuccess(res, leaderboard, 'Leaderboard fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.getWeeklyLeaderboard = async (req, res) => {
    try {
        const leaderboard = await leaderboardService.getWeeklyLeaderboard();
        sendSuccess(res, leaderboard, 'Weekly leaderboard fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};
