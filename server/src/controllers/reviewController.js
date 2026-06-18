const Review = require('../models/Review');
const PetrolPump = require('../models/PetrolPump');
const { sendResponse } = require('../utils/responseHandler');

const createReview = async (req, res) => {
  try {
    const { pumpId, rating, review } = req.body;
    const exists = await Review.findOne({ customerId: req.user._id, pumpId });
    if (exists) return sendResponse(res, 400, false, 'Review already submitted');
    const newReview = await Review.create({ customerId: req.user._id, pumpId, rating, review });
    const reviews = await Review.find({ pumpId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await PetrolPump.findByIdAndUpdate(pumpId, { rating: avg.toFixed(1), totalReviews: reviews.length });
    sendResponse(res, 201, true, 'Review submitted', newReview);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getPumpReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ pumpId: req.params.pumpId })
      .populate('customerId', 'name avatar')
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Reviews fetched', reviews);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

module.exports = { createReview, getPumpReviews };
