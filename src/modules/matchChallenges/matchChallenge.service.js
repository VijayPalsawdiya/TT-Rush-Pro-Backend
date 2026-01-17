const MatchChallenge = require('./matchChallenge.model');
const notificationService = require('../notifications/notification.service');

/**
 * Send a match challenge
 */
exports.sendChallenge = async (fromUserId, challengeData) => {
    const { toUserId, message, isSingles, partnerId } = challengeData;

    // Check if there's already a pending challenge between these users
    const existingChallenge = await MatchChallenge.findOne({
        $or: [
            { fromUser: fromUserId, toUser: toUserId, status: 'pending' },
            { fromUser: toUserId, toUser: fromUserId, status: 'pending' },
        ],
    });

    if (existingChallenge) {
        throw new Error('A pending challenge already exists between these players');
    }

    // Check weekly challenge limit (3 challenges per week between same players)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentChallenges = await MatchChallenge.countDocuments({
        $or: [
            { fromUser: fromUserId, toUser: toUserId },
            { fromUser: toUserId, toUser: fromUserId },
        ],
        createdAt: { $gte: oneWeekAgo },
    });

    if (recentChallenges >= 3) {
        throw new Error('Challenge limit reached. You can only challenge the same player 3 times per week');
    }

    // Create the challenge
    const challenge = await MatchChallenge.create({
        fromUser: fromUserId,
        toUser: toUserId,
        message,
        isSingles,
        partnerId,
    });

    // Populate user data
    await challenge.populate('fromUser', 'name profilePicture');
    await challenge.populate('toUser', 'name profilePicture');

    // Create notifications for both users
    await notificationService.createNotification({
        userId: toUserId,
        type: 'challenge-received',
        title: 'New Challenge!',
        message: `${challenge.fromUser.name} challenged you to a ${isSingles ? 'singles' : 'doubles'} match!`,
        relatedId: challenge._id,
    });

    await notificationService.createNotification({
        userId: fromUserId,
        type: 'challenge-sent',
        title: 'Challenge Sent',
        message: `Your challenge has been sent to ${challenge.toUser.name}`,
        relatedId: challenge._id,
    });

    return challenge;
};

/**
 * Get user's challenges (sent and received)
 */
exports.getUserChallenges = async (userId) => {
    const challenges = await MatchChallenge.find({
        $or: [{ fromUser: userId }, { toUser: userId }],
    })
        .populate('fromUser', 'name profilePicture')
        .populate('toUser', 'name profilePicture')
        .populate('partnerId', 'name profilePicture')
        .sort({ createdAt: -1 })
        .limit(50);

    return challenges;
};

/**
 * Accept a challenge
 */
exports.acceptChallenge = async (challengeId, userId, accepterPartnerId = null) => {
    const Match = require('../matches/match.model');

    const challenge = await MatchChallenge.findById(challengeId)
        .populate('fromUser', 'name')
        .populate('toUser', 'name')
        .populate('partnerId', 'name');

    if (!challenge) {
        throw new Error('Challenge not found');
    }

    if (challenge.toUser._id.toString() !== userId) {
        throw new Error('You are not authorized to accept this challenge');
    }

    if (challenge.status !== 'pending') {
        throw new Error('This challenge is no longer pending');
    }

    // For doubles, require accepterPartnerId
    if (!challenge.isSingles && !accepterPartnerId) {
        throw new Error('Partner selection is required for doubles matches');
    }

    // Store accepter's partner if doubles
    if (!challenge.isSingles && accepterPartnerId) {
        challenge.accepterPartnerId = accepterPartnerId;
    }

    challenge.status = 'accepted';
    await challenge.save();

    // Create a match for the accepted challenge
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() + 1); // Schedule for tomorrow

    let match;

    if (challenge.isSingles) {
        // Singles match
        match = await Match.create({
            challengeId: challenge._id,
            isSingles: true,
            player1: challenge.fromUser._id,
            player2: challenge.toUser._id,
            status: 'pending',
            matchDate: matchDate,
        });

        // Populate for socket event
        await match.populate('player1', 'name profilePicture');
        await match.populate('player2', 'name profilePicture');
    } else {
        // Doubles match
        match = await Match.create({
            challengeId: challenge._id,
            isSingles: false,
            team1Player1: challenge.fromUser._id,
            team1Player2: challenge.partnerId,
            team2Player1: challenge.toUser._id,
            team2Player2: accepterPartnerId,
            status: 'pending',
            matchDate: matchDate,
        });

        // Populate for socket event
        await match.populate('team1Player1', 'name profilePicture');
        await match.populate('team1Player2', 'name profilePicture');
        await match.populate('team2Player1', 'name profilePicture');
        await match.populate('team2Player2', 'name profilePicture');
    }

    console.log('✅ Match created:', {
        matchId: match._id,
        type: challenge.isSingles ? 'singles' : 'doubles',
        status: match.status,
        matchDate: match.matchDate
    });

    // Emit socket event to all players for real-time update
    try {
        const { emitToUsers } = require('../../socket');
        const userIds = challenge.isSingles
            ? [challenge.fromUser._id.toString(), challenge.toUser._id.toString()]
            : [
                challenge.fromUser._id.toString(),
                challenge.partnerId.toString(),
                challenge.toUser._id.toString(),
                accepterPartnerId.toString()
            ];

        emitToUsers(userIds, 'match:created', match);
    } catch (error) {
        console.warn('Socket emit failed:', error.message);
    }

    // Notify the challenger
    const partnerMessage = challenge.isSingles
        ? ''
        : ` Your partner: ${challenge.partnerId?.name || 'Partner'}`;

    await notificationService.createNotification({
        userId: challenge.fromUser._id,
        type: 'challenge-accepted',
        title: 'Challenge Accepted!',
        message: `${challenge.toUser.name} accepted your ${challenge.isSingles ? 'singles' : 'doubles'} challenge!${partnerMessage} Match scheduled for ${matchDate.toLocaleDateString()}`,
        relatedId: match._id,
    });

    return { challenge, match };
};

/**
 * Reject a challenge
 */
exports.rejectChallenge = async (challengeId, userId) => {
    const challenge = await MatchChallenge.findById(challengeId)
        .populate('fromUser', 'name')
        .populate('toUser', 'name');

    if (!challenge) {
        throw new Error('Challenge not found');
    }

    if (challenge.toUser._id.toString() !== userId) {
        throw new Error('You are not authorized to reject this challenge');
    }

    if (challenge.status !== 'pending') {
        throw new Error('This challenge is no longer pending');
    }

    challenge.status = 'rejected';
    await challenge.save();

    // Notify the challenger
    await notificationService.createNotification({
        userId: challenge.fromUser._id,
        type: 'challenge-rejected',
        title: 'Challenge Declined',
        message: `${challenge.toUser.name} declined your challenge`,
        relatedId: challenge._id,
    });

    return challenge;
};

/**
 * Get challenge status between two users
 */
exports.getChallengeStatus = async (fromUserId, toUserId) => {
    // Check for pending challenge
    const pendingChallenge = await MatchChallenge.findOne({
        $or: [
            { fromUser: fromUserId, toUser: toUserId, status: 'pending' },
            { fromUser: toUserId, toUser: fromUserId, status: 'pending' },
        ],
    });

    if (pendingChallenge) {
        return {
            canChallenge: false,
            reason: 'pending',
            challengeId: pendingChallenge._id,
            isSender: pendingChallenge.fromUser.toString() === fromUserId,
        };
    }

    // Check weekly limit
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentChallenges = await MatchChallenge.countDocuments({
        $or: [
            { fromUser: fromUserId, toUser: toUserId },
            { fromUser: toUserId, toUser: fromUserId },
        ],
        createdAt: { $gte: oneWeekAgo },
    });

    if (recentChallenges >= 3) {
        return {
            canChallenge: false,
            reason: 'limit_reached',
            challengesThisWeek: recentChallenges,
        };
    }

    return {
        canChallenge: true,
        challengesThisWeek: recentChallenges,
    };
};

/**
 * Get challenge statuses for multiple users (batch)
 */
exports.getBatchChallengeStatus = async (fromUserId, toUserIds) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find all pending challenges involving the fromUser and any of the toUsers
    const pendingChallenges = await MatchChallenge.find({
        $or: [
            { fromUser: fromUserId, toUser: { $in: toUserIds }, status: 'pending' },
            { fromUser: { $in: toUserIds }, toUser: fromUserId, status: 'pending' },
        ],
    });

    // Create a map of userId -> pending challenge
    const pendingMap = {};
    pendingChallenges.forEach(challenge => {
        const otherUserId = challenge.fromUser.toString() === fromUserId
            ? challenge.toUser.toString()
            : challenge.fromUser.toString();
        pendingMap[otherUserId] = {
            challengeId: challenge._id,
            isSender: challenge.fromUser.toString() === fromUserId,
        };
    });

    // Get all recent challenges for limit checking
    const recentChallenges = await MatchChallenge.find({
        $or: [
            { fromUser: fromUserId, toUser: { $in: toUserIds } },
            { fromUser: { $in: toUserIds }, toUser: fromUserId },
        ],
        createdAt: { $gte: oneWeekAgo },
    });

    // Count challenges per user pair
    const challengeCounts = {};
    recentChallenges.forEach(challenge => {
        const otherUserId = challenge.fromUser.toString() === fromUserId
            ? challenge.toUser.toString()
            : challenge.fromUser.toString();
        challengeCounts[otherUserId] = (challengeCounts[otherUserId] || 0) + 1;
    });

    // Build response for each user
    const statuses = {};
    toUserIds.forEach(toUserId => {
        const toUserIdStr = toUserId.toString();

        // Check if there's a pending challenge
        if (pendingMap[toUserIdStr]) {
            statuses[toUserIdStr] = {
                canChallenge: false,
                reason: 'pending',
                challengeId: pendingMap[toUserIdStr].challengeId,
                isSender: pendingMap[toUserIdStr].isSender,
            };
        }
        // Check weekly limit
        else if (challengeCounts[toUserIdStr] >= 3) {
            statuses[toUserIdStr] = {
                canChallenge: false,
                reason: 'limit_reached',
                challengesThisWeek: challengeCounts[toUserIdStr],
            };
        }
        // Can challenge
        else {
            statuses[toUserIdStr] = {
                canChallenge: true,
                challengesThisWeek: challengeCounts[toUserIdStr] || 0,
            };
        }
    });

    return statuses;
};
