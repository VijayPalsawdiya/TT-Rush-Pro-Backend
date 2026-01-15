const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const challengeRoutes = require('./modules/challenges/challenge.routes');
const matchRoutes = require('./modules/matches/match.routes');
const leaderboardRoutes = require('./modules/leaderboard/leaderboard.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const homeRoutes = require('./modules/home/home.routes');
const statsRoutes = require('./modules/stats/stats.routes');
const uploadRoutes = require('./modules/upload/upload.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/challenges', challengeRoutes);
router.use('/matches', matchRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/home', homeRoutes);
router.use('/stats', statsRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
