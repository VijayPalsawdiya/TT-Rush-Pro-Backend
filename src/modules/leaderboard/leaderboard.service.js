const User = require('../users/user.model');

/**
 * Get overall leaderboard with optional filters
 * @param {Object} filters - Query filters (limit, gender)
 * @returns {Promise<Array>} Array of leaderboard entries with user and rank
 */
exports.getLeaderboard = async (filters) => {
    const limit = parseInt(filters.limit) || 100;
    const { gender } = filters;

    // Build query
    const query = {};
    if (gender && (gender === 'male' || gender === 'female')) {
        query.gender = gender;
    }

    // Fetch users sorted by ranking (points)
    const users = await User.find(query)
        .select('name email profilePicture gender phoneNumber gameType ranking totalWins totalLosses winPercentage')
        .sort({ ranking: -1, winPercentage: -1, totalWins: -1 })
        .limit(limit);

    // Map to leaderboard format with rank position
    return users.map((user, index) => ({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            gameType: user.gameType,
            points: user.ranking, // ranking field represents points
            totalWins: user.totalWins,
            totalLosses: user.totalLosses,
            totalMatches: user.totalWins + user.totalLosses,
            winPercentage: user.winPercentage,
            rank: user.ranking,
        },
        rank: index + 1, // Position in leaderboard (1st, 2nd, 3rd, etc.)
    }));
};

/**
 * Get weekly leaderboard
 * @returns {Promise<Array>} Array of weekly leaderboard entries
 */
exports.getWeeklyLeaderboard = async () => {
    const users = await User.find()
        .select('name email profilePicture gender phoneNumber gameType weeklyWins weeklyLosses ranking totalWins totalLosses winPercentage')
        .sort({ weeklyWins: -1, weeklyLosses: 1 })
        .limit(100);

    return users.map((user, index) => ({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            gameType: user.gameType,
            points: user.ranking,
            totalWins: user.totalWins,
            totalLosses: user.totalLosses,
            totalMatches: user.totalWins + user.totalLosses,
            winPercentage: user.winPercentage,
            rank: user.ranking,
            weeklyWins: user.weeklyWins,
            weeklyLosses: user.weeklyLosses,
        },
        rank: index + 1,
    }));
};
