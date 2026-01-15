const User = require('../users/user.model');
const Match = require('../matches/match.model');
const { calculateWinPercentage } = require('../../utils/percentage.util');

exports.getUserStats = async (userId) => {
    const user = await User.findById(userId);

    const totalMatches = await Match.countDocuments({
        $or: [{ player1: userId }, { player2: userId }],
        status: 'completed',
    });

    const winPercentage = calculateWinPercentage(user.totalWins, user.totalLosses);

    return {
        totalWins: user.totalWins,
        totalLosses: user.totalLosses,
        weeklyWins: user.weeklyWins,
        weeklyLosses: user.weeklyLosses,
        totalMatches,
        winPercentage,
        ranking: user.ranking,
    };
};
