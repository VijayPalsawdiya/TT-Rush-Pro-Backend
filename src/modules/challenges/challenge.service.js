const Challenge = require('./challenge.model');

exports.getChallenges = async (filters) => {
    const query = { isActive: true };

    if (filters.type) {
        query.type = filters.type;
    }

    return await Challenge.find(query).sort({ createdAt: -1 });
};

exports.getChallengeById = async (challengeId) => {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
        throw new Error('Challenge not found');
    }
    return challenge;
};

exports.createChallenge = async (challengeData) => {
    return await Challenge.create(challengeData);
};
