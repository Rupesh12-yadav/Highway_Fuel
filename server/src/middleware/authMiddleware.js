const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return sendResponse(res, 401, false, 'Not authorized, no token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return sendResponse(res, 401, false, 'User not found');
    next();
  } catch {
    sendResponse(res, 401, false, 'Not authorized, token failed');
  }
};

module.exports = { protect };
