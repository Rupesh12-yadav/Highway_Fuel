const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pumpId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetrolPump', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

reviewSchema.index({ customerId: 1, pumpId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
