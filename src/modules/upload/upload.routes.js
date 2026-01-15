const express = require('express');
const uploadController = require('./upload.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

// Image upload endpoint
router.post('/image', authMiddleware, uploadController.uploadImage);

// Image delete endpoint (using POST for better compatibility)
router.post('/image/delete', authMiddleware, uploadController.deleteImage);

module.exports = router;
