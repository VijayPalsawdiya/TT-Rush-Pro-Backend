const Joi = require('joi');

exports.createMatch = {
    body: Joi.object({
        challengeId: Joi.string().required(),
        player1: Joi.string().required(),
        player2: Joi.string().required(),
    }),
};

exports.updateMatchResult = {
    body: Joi.object({
        score: Joi.object({
            player1Score: Joi.number().required(),
            player2Score: Joi.number().required(),
        }).required(),
        winner: Joi.string().required(),
    }),
};
