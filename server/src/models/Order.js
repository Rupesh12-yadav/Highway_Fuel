const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pumpId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetrolPump', required: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng', 'ev'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerLitre: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
