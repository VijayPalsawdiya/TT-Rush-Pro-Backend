const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const authValidation = require('./auth.validation');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/google', validate(authValidation.googleLogin), authController.googleLogin);
router.post('/refresh', validate(authValidation.refreshToken), authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
