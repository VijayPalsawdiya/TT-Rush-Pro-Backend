const Match = require('./match.model');
const User = require('../users/user.model');

exports.createMatch = async (matchData) => {
    return await Match.create(matchData);
};

exports.getMatches = async (filters) => {
    const query = {};

    if (filters.challengeId) {
        query.challengeId = filters.challengeId;
    }

    if (filters.userId) {
        query.$or = [
            { player1: filters.userId },
            { player2: filters.userId },
        ];
    }

    return await Match.find(query)
        .populate('player1', 'name profilePicture')
        .populate('player2', 'name profilePicture')
        .populate('winner', 'name')
        .sort({ createdAt: -1 });
};

exports.updateMatchResult = async (matchId, resultData) => {
    const match = await Match.findById(matchId);

    if (!match) {
        throw new Error('Match not found');
    }

    match.score = resultData.score;
    match.winner = resultData.winner;
    match.status = 'completed';

    await match.save();

    // Update user stats
    await updateUserStats(match);

    return match;
};

async function updateUserStats(match) {
    const winner = await User.findById(match.winner);
    const loser = match.player1.equals(match.winner) ? match.player2 : match.player1;

    // Update winner stats
    await User.findByIdAndUpdate(winner._id, {
        $inc: { totalWins: 1, weeklyWins: 1 },
    });

    // Update loser stats
    await User.findByIdAndUpdate(loser, {
        $inc: { totalLosses: 1, weeklyLosses: 1 },
    });
}
