const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  getAllOrders,
  trackOrder,
  getOrderStatus
} = require('../../controllers/user/orderTrackingController');

const router = express.Router();

// ✅ Get All Orders of User
router.get('/orders', authenticate, getAllOrders);

// ✅ Track a Specific Order by Order ID
router.get('/track/:orderId', authenticate, trackOrder);

// ✅ Get Real-Time Order Status
router.get('/status/:orderId', authenticate, getOrderStatus);

module.exports = router;
