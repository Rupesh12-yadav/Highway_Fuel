const express = require('express');
const router = express.Router();
const { createReview, getPumpReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/:pumpId', getPumpReviews);

module.exports = router;
