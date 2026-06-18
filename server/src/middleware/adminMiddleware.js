const { sendResponse } = require('../utils/responseHandler');

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return sendResponse(res, 403, false, 'Admin access only');
  next();
};

module.exports = { adminOnly };
