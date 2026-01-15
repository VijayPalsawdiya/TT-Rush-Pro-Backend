const express = require('express');
const homeController = require('./home.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, homeController.getHomeData);

module.exports = router;
