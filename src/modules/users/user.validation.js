const Joi = require('joi');

exports.updateProfile = {
    body: Joi.object({
        name: Joi.string().trim(),
        profilePicture: Joi.string().uri(),
        gender: Joi.string().valid('male', 'female'),
        phoneNumber: Joi.string().trim(),
        gameType: Joi.string().valid('right-hand', 'left-hand'),
    }),
};

exports.updateFCMToken = {
    body: Joi.object({
        fcmToken: Joi.string().required(),
    }),
};
