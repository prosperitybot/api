const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
	response.status(200).json({ message: 'Welcome to the Prosperity API' });
});

router.use('/leaderboard', require('./routes/leaderboard'));
router.use('/stats', require('./routes/stats'));

module.exports = router;