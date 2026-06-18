const mongoose = require('mongoose');

const petrolPumpSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pumpName: { type: String, required: true },
  highway: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  fuelTypes: [{
    type: { type: String, enum: ['petrol', 'diesel', 'cng', 'ev'] },
    pricePerLitre: { type: Number },
    available: { type: Boolean, default: true }
  }],
  image: { type: String, default: '' },
  license: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('PetrolPump', petrolPumpSchema);
