const User = require('../users/user.model');
const Match = require('../matches/match.model');
const Challenge = require('../challenges/challenge.model');

/**
 * Get home screen data for a user
 * @param {String} userId - User ID
 * @returns {Object} Home data including user, matches, challenges, and top players
 */
exports.getHomeData = async (userId) => {
    // Get user data
    const user = await User.findById(userId).select('-refreshToken');

    // Get upcoming matches (pending status)
    const upcomingMatches = await Match.find({
        $or: [{ player1: userId }, { player2: userId }],
        status: 'pending',
    })
        .populate('player1', 'name profilePicture')
        .populate('player2', 'name profilePicture')
        .sort({ matchDate: 1 })
        .limit(5);

    // Get recent completed matches
    const recentMatches = await Match.find({
        $or: [{ player1: userId }, { player2: userId }],
        status: 'completed',
    })
        .populate('player1', 'name profilePicture')
        .populate('player2', 'name profilePicture')
        .populate('winner', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    // Get active challenges
    const activeChallenges = await Challenge.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(3);

    // Get top players
    const topPlayers = await User.find()
        .select('name profilePicture ranking totalWins totalLosses winPercentage')
        .sort({ ranking: -1 })
        .limit(10);

    return {
        user,
        upcomingMatches,
        recentMatches,
        activeChallenges,
        topPlayers,
    };
};
