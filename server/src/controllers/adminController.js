const User = require('../models/User');
const PetrolPump = require('../models/PetrolPump');
const Order = require('../models/Order');
const { sendResponse } = require('../utils/responseHandler');

const getDashboardStats = async (req, res) => {
  try {
    const [users, pumps, orders] = await Promise.all([
      User.countDocuments(), PetrolPump.countDocuments(), Order.countDocuments()
    ]);
    const revenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    sendResponse(res, 200, true, 'Stats fetched', { users, pumps, orders, revenue: revenue[0]?.total || 0 });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Users fetched', users);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).select('-password');
    if (!user) return sendResponse(res, 404, false, 'User not found');
    sendResponse(res, 200, true, 'User status updated', user);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getPendingPumps = async (req, res) => {
  try {
    const pumps = await PetrolPump.find({ isApproved: false }).populate('ownerId', 'name email');
    sendResponse(res, 200, true, 'Pending pumps fetched', pumps);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const approvePump = async (req, res) => {
  try {
    const pump = await PetrolPump.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!pump) return sendResponse(res, 404, false, 'Pump not found');
    sendResponse(res, 200, true, 'Pump approved', pump);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('pumpId', 'pumpName city')
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'All orders fetched', orders);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

module.exports = { getDashboardStats, getAllUsers, updateUserStatus, getPendingPumps, approvePump, getAllOrders };
