const User = require('../models/User');
const { sendResponse } = require('../utils/responseHandler');

const getProfile = async (req, res) => {
  sendResponse(res, 200, true, 'Profile fetched', req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const update = { name, phone };
    if (req.file) update.avatar = req.file.path;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    sendResponse(res, 200, true, 'Profile updated', user);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(req.body.currentPassword))) return sendResponse(res, 400, false, 'Wrong current password');
    user.password = req.body.newPassword;
    await user.save();
    sendResponse(res, 200, true, 'Password changed');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
