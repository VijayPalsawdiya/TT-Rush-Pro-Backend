const Joi = require('joi');

exports.createChallenge = {
    body: Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid('rank', 'weekly').required(),
        minRank: Joi.number().when('type', {
            is: 'rank',
            then: Joi.required(),
        }),
        maxRank: Joi.number().when('type', {
            is: 'rank',
            then: Joi.required(),
        }),
        weekNumber: Joi.number().when('type', {
            is: 'weekly',
            then: Joi.required(),
        }),
        year: Joi.number().when('type', {
            is: 'weekly',
            then: Joi.required(),
        }),
        startDate: Joi.date(),
        endDate: Joi.date(),
    }),
};
