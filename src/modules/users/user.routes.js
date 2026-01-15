const express = require('express');
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const userValidation = require('./user.validation');

const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, validate(userValidation.updateProfile), userController.updateProfile);
router.post('/fcm-token', authMiddleware, validate(userValidation.updateFCMToken), userController.updateFCMToken);

module.exports = router;
