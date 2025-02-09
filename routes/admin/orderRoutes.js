const express = require('express');
const authenticate= require('../../middlewares/authMiddleware');
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  manageDeliveryAgent,
  updateTrackingDetails,
  updatePaymentStatus,
  cancelOrder
} = require('../../controllers/admin/orderController');

const router = express.Router();


router.get('/orders', authenticate, getAllOrders);
router.get('/orders/:orderId', authenticate, getOrderById);
router.put('/orders/:orderId/status', authenticate, updateOrderStatus);
router.put('/orders/:orderId/delivery-agent', authenticate, manageDeliveryAgent);
router.put('/orders/:orderId/tracking', authenticate, updateTrackingDetails);
router.put('/orders/:orderId/payment-status', authenticate, updatePaymentStatus);
router.put('/orders/:orderId/cancel', authenticate, cancelOrder);

module.exports = router;
