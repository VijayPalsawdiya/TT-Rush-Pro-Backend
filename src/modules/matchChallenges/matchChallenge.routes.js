const express = require('express');
const matchChallengeController = require('./matchChallenge.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const matchChallengeValidation = require('./matchChallenge.validation');

const router = express.Router();

router.post('/', authMiddleware, validate(matchChallengeValidation.sendChallenge), matchChallengeController.sendChallenge);
router.get('/', authMiddleware, matchChallengeController.getUserChallenges);
router.put('/:id/accept', authMiddleware, matchChallengeController.acceptChallenge);
router.put('/:id/reject', authMiddleware, matchChallengeController.rejectChallenge);
router.get('/status/:userId', authMiddleware, matchChallengeController.getChallengeStatus);

module.exports = router;
