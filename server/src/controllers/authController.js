const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendResponse } = require('../utils/responseHandler');

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (await User.findOne({ email })) return sendResponse(res, 400, false, 'Email already exists');
    const user = await User.create({ name, email, password, role: role || 'customer', phone });
    const token = generateToken(user._id, user.role);
    sendResponse(res, 201, true, 'Registered successfully', { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return sendResponse(res, 401, false, 'Invalid credentials');
    if (user.status === 'banned') return sendResponse(res, 403, false, 'Account banned');
    const token = generateToken(user._id, user.role);
    sendResponse(res, 200, true, 'Login successful', { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const logout = (req, res) => sendResponse(res, 200, true, 'Logged out successfully');

const getMe = async (req, res) => {
  sendResponse(res, 200, true, 'Profile fetched', req.user);
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return sendResponse(res, 404, false, 'User not found');
    sendResponse(res, 200, true, 'Password reset email sent (implement email service)');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

module.exports = { register, login, logout, getMe, forgotPassword };
