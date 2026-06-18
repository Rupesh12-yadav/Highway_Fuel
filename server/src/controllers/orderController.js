const Order = require('../models/Order');
const PetrolPump = require('../models/PetrolPump');
const { sendResponse } = require('../utils/responseHandler');

const createOrder = async (req, res) => {
  try {
    const { pumpId, fuelType, quantity, deliveryAddress, notes } = req.body;
    const pump = await PetrolPump.findById(pumpId);
    if (!pump) return sendResponse(res, 404, false, 'Pump not found');
    const fuel = pump.fuelTypes.find(f => f.type === fuelType && f.available);
    if (!fuel) return sendResponse(res, 400, false, 'Fuel type not available');
    const order = await Order.create({
      customerId: req.user._id, pumpId, fuelType, quantity,
      pricePerLitre: fuel.pricePerLitre,
      amount: fuel.pricePerLitre * quantity,
      deliveryAddress, notes
    });
    sendResponse(res, 201, true, 'Order placed', order);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('pumpId', 'pumpName address city')
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Orders fetched', orders);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('pumpId', 'pumpName address city');
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    sendResponse(res, 200, true, 'Order fetched', order);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    sendResponse(res, 200, true, 'Order status updated', order);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getDealerOrders = async (req, res) => {
  try {
    const pumps = await PetrolPump.find({ ownerId: req.user._id }).select('_id');
    const pumpIds = pumps.map(p => p._id);
    const orders = await Order.find({ pumpId: { $in: pumpIds } })
      .populate('customerId', 'name email phone')
      .populate('pumpId', 'pumpName')
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Dealer orders fetched', orders);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getDealerOrders };
