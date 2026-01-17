const matchChallengeService = require('./matchChallenge.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.sendChallenge = async (req, res) => {
    try {
        const challenge = await matchChallengeService.sendChallenge(req.user.id, req.body);
        sendSuccess(res, challenge, 'Challenge sent successfully', 201);
    } catch (error) {
        sendError(res, error);
    }
};

exports.getUserChallenges = async (req, res) => {
    try {
        const challenges = await matchChallengeService.getUserChallenges(req.user.id);
        sendSuccess(res, challenges, 'Challenges fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.acceptChallenge = async (req, res) => {
    try {
        const { accepterPartnerId } = req.body;
        const result = await matchChallengeService.acceptChallenge(
            req.params.id,
            req.user.id,
            accepterPartnerId
        );
        sendSuccess(res, result, 'Challenge accepted successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.rejectChallenge = async (req, res) => {
    try {
        const challenge = await matchChallengeService.rejectChallenge(req.params.id, req.user.id);
        sendSuccess(res, challenge, 'Challenge rejected successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.getChallengeStatus = async (req, res) => {
    try {
        const status = await matchChallengeService.getChallengeStatus(req.user.id, req.params.userId);
        sendSuccess(res, status, 'Challenge status fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.getBatchChallengeStatus = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return sendError(res, new Error('userIds must be a non-empty array'));
        }

        const statuses = await matchChallengeService.getBatchChallengeStatus(req.user.id, userIds);
        sendSuccess(res, statuses, 'Batch challenge statuses fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};
