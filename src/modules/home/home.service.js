const User = require('../users/user.model');
const Match = require('../matches/match.model');
const Challenge = require('../challenges/challenge.model');

exports.getHomeData = async (userId) => {
    const user = await User.findById(userId).select('-refreshToken');

    const recentMatches = await Match.find({
        $or: [{ player1: userId }, { player2: userId }],
    })
        .populate('player1', 'name profilePicture')
        .populate('player2', 'name profilePicture')
        .sort({ createdAt: -1 })
        .limit(5);

    const activeChallenges = await Challenge.find({ isActive: true }).limit(3);

    const topPlayers = await User.find()
        .select('name profilePicture ranking')
        .sort({ ranking: -1 })
        .limit(10);

    return {
        user,
        recentMatches,
        activeChallenges,
        topPlayers,
    };
};
