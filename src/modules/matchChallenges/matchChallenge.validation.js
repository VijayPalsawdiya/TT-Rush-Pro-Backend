const Joi = require('joi');

exports.sendChallenge = {
    body: Joi.object({
        toUserId: Joi.string().required(),
        message: Joi.string().max(200),
        isSingles: Joi.boolean().default(true),
        partnerId: Joi.string(),
    }),
};
