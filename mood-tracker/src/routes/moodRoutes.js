const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.post('/log', moodController.logMood);
router.get('/insights', moodController.getInsights);

module.exports = router;