const express = require('express');
const leaderboardController = require('./leaderboard.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, leaderboardController.getLeaderboard);
router.get('/weekly', authMiddleware, leaderboardController.getWeeklyLeaderboard);

module.exports = router;
