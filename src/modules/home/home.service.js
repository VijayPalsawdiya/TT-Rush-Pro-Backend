const Match = require('../matches/match.model');
const User = require('../users/user.model');

/**
 * Get home screen data for a user
 * @param {String} userId - User ID
 * @returns {Object} Home data including user, matches, challenges, and top players
 */
exports.getHomeData = async (userId) => {
    // Get user data
    const user = await User.findById(userId).select('-refreshToken');

    console.log('🔍 Fetching upcoming matches for user:', userId);

    // Get upcoming matches (pending status) - includes both singles and doubles
    const upcomingMatches = await Match.find({
        $or: [
            // Singles matches
            { player1: userId },
            { player2: userId },
            // Doubles matches
            { team1Player1: userId },
            { team1Player2: userId },
            { team2Player1: userId },
            { team2Player2: userId },
        ],
        status: 'pending',
    })
        .populate('player1', 'name profilePicture')
        .populate('player2', 'name profilePicture')
        .populate('team1Player1', 'name profilePicture')
        .populate('team1Player2', 'name profilePicture')
        .populate('team2Player1', 'name profilePicture')
        .populate('team2Player2', 'name profilePicture')
        .sort({ matchDate: 1 })
        .limit(5);

    console.log('📊 Found upcoming matches:', upcomingMatches.length);
    if (upcomingMatches.length > 0) {
        console.log('Matches:', upcomingMatches.map(m => ({
            id: m._id,
            isSingles: m.isSingles,
            player1: m.player1?.name,
            player2: m.player2?.name,
            team1: m.isSingles ? null : `${m.team1Player1?.name} & ${m.team1Player2?.name}`,
            team2: m.isSingles ? null : `${m.team2Player1?.name} & ${m.team2Player2?.name}`,
            status: m.status,
            date: m.matchDate
        })));
    }

    // Get recent completed matches - includes both singles and doubles
    const recentMatches = await Match.find({
        $or: [
            // Singles matches
            { player1: userId },
            { player2: userId },
            // Doubles matches
            { team1Player1: userId },
            { team1Player2: userId },
            { team2Player1: userId },
            { team2Player2: userId },
        ],
        status: 'completed',
    })
        .populate('player1', 'name profilePicture')
        .populate('player2', 'name profilePicture')
        .populate('team1Player1', 'name profilePicture')
        .populate('team1Player2', 'name profilePicture')
        .populate('team2Player1', 'name profilePicture')
        .populate('team2Player2', 'name profilePicture')
        .populate('winner', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    // Get active challenges (tournament challenges, not match challenges)
    const Challenge = require('../challenges/challenge.model');
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
