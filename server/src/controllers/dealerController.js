const PetrolPump = require('../models/PetrolPump');
const Order = require('../models/Order');
const { sendResponse } = require('../utils/responseHandler');

const getDealerStats = async (req, res) => {
  try {
    const pumps = await PetrolPump.find({ ownerId: req.user._id }).select('_id');
    const pumpIds = pumps.map(p => p._id);
    const [totalOrders, completedOrders] = await Promise.all([
      Order.countDocuments({ pumpId: { $in: pumpIds } }),
      Order.countDocuments({ pumpId: { $in: pumpIds }, status: 'completed' })
    ]);
    const revenue = await Order.aggregate([
      { $match: { pumpId: { $in: pumpIds }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    sendResponse(res, 200, true, 'Stats fetched', { totalPumps: pumps.length, totalOrders, completedOrders, revenue: revenue[0]?.total || 0 });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

module.exports = { getDealerStats };
