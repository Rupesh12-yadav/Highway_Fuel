const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getDealerOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { dealerOnly } = require('../middleware/dealerMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/dealer', protect, dealerOnly, getDealerOrders);
router.get('/:id', protect, getOrderById);
router.patch('/status/:id', protect, dealerOnly, updateOrderStatus);

module.exports = router;
