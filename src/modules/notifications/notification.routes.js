const express = require('express');
const notificationController = require('./notification.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, notificationController.getNotifications);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);
router.post('/send', authMiddleware, notificationController.sendNotification);

module.exports = router;
