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
exports.acceptChallenge = async (challengeId, userId) => {
    const Match = require('../matches/match.model');

    const challenge = await MatchChallenge.findById(challengeId)
        .populate('fromUser', 'name')
        .populate('toUser', 'name');

    if (!challenge) {
        throw new Error('Challenge not found');
    }

    if (challenge.toUser._id.toString() !== userId) {
        throw new Error('You are not authorized to accept this challenge');
    }

    if (challenge.status !== 'pending') {
        throw new Error('This challenge is no longer pending');
    }

    challenge.status = 'accepted';
    await challenge.save();

    // Create a match for the accepted challenge
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() + 1); // Schedule for tomorrow

    const match = await Match.create({
        challengeId: challenge._id,
        player1: challenge.fromUser._id,
        player2: challenge.toUser._id,
        status: 'pending',
        matchDate: matchDate,
    });

    console.log('✅ Match created:', {
        matchId: match._id,
        player1: challenge.fromUser.name,
        player2: challenge.toUser.name,
        status: match.status,
        matchDate: match.matchDate
    });

    // Notify the challenger
    await notificationService.createNotification({
        userId: challenge.fromUser._id,
        type: 'challenge-accepted',
        title: 'Challenge Accepted!',
        message: `${challenge.toUser.name} accepted your challenge! Match scheduled for ${matchDate.toLocaleDateString()}`,
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
