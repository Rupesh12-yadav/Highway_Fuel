const express = require('express');
const router = express.Router();
const { getDealerStats } = require('../controllers/dealerController');
const { protect } = require('../middleware/authMiddleware');
const { dealerOnly } = require('../middleware/dealerMiddleware');

router.get('/stats', protect, dealerOnly, getDealerStats);

module.exports = router;
