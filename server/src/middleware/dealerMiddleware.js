const { sendResponse } = require('../utils/responseHandler');

const dealerOnly = (req, res, next) => {
  if (!['dealer', 'admin'].includes(req.user?.role)) return sendResponse(res, 403, false, 'Dealer access only');
  next();
};

module.exports = { dealerOnly };
