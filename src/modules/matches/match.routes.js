const express = require('express');
const matchController = require('./match.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const matchValidation = require('./match.validation');

const router = express.Router();

router.post('/', authMiddleware, validate(matchValidation.createMatch), matchController.createMatch);
router.get('/', authMiddleware, matchController.getMatches);
router.put('/:id/result', authMiddleware, validate(matchValidation.updateMatchResult), matchController.updateMatchResult);

module.exports = router;
