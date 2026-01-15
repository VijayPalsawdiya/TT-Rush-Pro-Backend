const Joi = require('joi');

exports.updateProfile = {
    body: Joi.object({
        name: Joi.string().trim(),
        profilePicture: Joi.string().uri(),
    }),
};

exports.updateFCMToken = {
    body: Joi.object({
        fcmToken: Joi.string().required(),
    }),
};
