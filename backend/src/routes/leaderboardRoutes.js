const express = require('express');
const router = express.Router();
const { getLeaderboard, getTop5 } = require('../controllers/leaderboardController');

router.get('/', getLeaderboard);
router.get('/top5', getTop5);

module.exports = router;