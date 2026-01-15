const express = require('express');
const statsController = require('./stats.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, statsController.getUserStats);

module.exports = router;
