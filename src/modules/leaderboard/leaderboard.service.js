const User = require('../users/user.model');

exports.getLeaderboard = async (filters) => {
    const limit = parseInt(filters.limit) || 100;

    return await User.find()
        .select('name profilePicture ranking totalWins totalLosses winPercentage')
        .sort({ ranking: -1 })
        .limit(limit);
};

exports.getWeeklyLeaderboard = async () => {
    return await User.find()
        .select('name profilePicture weeklyWins weeklyLosses')
        .sort({ weeklyWins: -1 })
        .limit(100);
};
