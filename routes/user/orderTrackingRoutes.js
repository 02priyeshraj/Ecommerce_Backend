const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  getAllOrders,
  trackOrder,
  getOrderStatus
} = require('../../controllers/user/orderTrackingController');

const router = express.Router();


router.get('/orders', authenticate, getAllOrders);
router.get('/track/:orderId', authenticate, trackOrder);
router.get('/status/:orderId', authenticate, getOrderStatus);

module.exports = router;
