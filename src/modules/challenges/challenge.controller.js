const challengeService = require('./challenge.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.getChallenges = async (req, res) => {
    try {
        const challenges = await challengeService.getChallenges(req.query);
        sendSuccess(res, challenges, 'Challenges fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.getChallengeById = async (req, res) => {
    try {
        const challenge = await challengeService.getChallengeById(req.params.id);
        sendSuccess(res, challenge, 'Challenge fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.createChallenge = async (req, res) => {
    try {
        const challenge = await challengeService.createChallenge(req.body);
        sendSuccess(res, challenge, 'Challenge created successfully', 201);
    } catch (error) {
        sendError(res, error);
    }
};
