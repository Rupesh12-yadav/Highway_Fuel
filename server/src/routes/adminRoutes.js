const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserStatus, getPendingPumps, approvePump, getAllOrders } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/pumps/pending', getPendingPumps);
router.patch('/pumps/:id/approve', approvePump);
router.get('/orders', getAllOrders);

module.exports = router;
