const express = require('express');
const challengeController = require('./challenge.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const challengeValidation = require('./challenge.validation');

const router = express.Router();

router.get('/', authMiddleware, challengeController.getChallenges);
router.get('/:id', authMiddleware, challengeController.getChallengeById);
router.post('/', authMiddleware, validate(challengeValidation.createChallenge), challengeController.createChallenge);

module.exports = router;
