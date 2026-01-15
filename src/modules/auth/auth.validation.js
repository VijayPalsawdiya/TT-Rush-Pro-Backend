const Joi = require('joi');

exports.googleLogin = {
    body: Joi.object({
        token: Joi.string().required(),
    }),
};

exports.refreshToken = {
    body: Joi.object({
        refreshToken: Joi.string().required(),
    }),
};
