const matchService = require('./match.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.createMatch = async (req, res) => {
    try {
        const match = await matchService.createMatch(req.body);
        sendSuccess(res, match, 'Match created successfully', 201);
    } catch (error) {
        sendError(res, error);
    }
};

exports.getMatches = async (req, res) => {
    try {
        const matches = await matchService.getMatches(req.query);
        sendSuccess(res, matches, 'Matches fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};

exports.updateMatchResult = async (req, res) => {
    try {
        const match = await matchService.updateMatchResult(req.params.id, req.body);
        sendSuccess(res, match, 'Match result updated successfully');
    } catch (error) {
        sendError(res, error);
    }
};
