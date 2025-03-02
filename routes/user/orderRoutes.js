const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  getAllAddresses,
  verifyShippingAddress
} = require('../../controllers/user/orderController');

const router = express.Router();

router.post('/place', authenticate, placeOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:orderId', authenticate, getOrderDetails);
router.put('/cancel/:orderId', authenticate, cancelOrder);
router.get('/address/all', authenticate, getAllAddresses);
router.get('/:orderId/verify-shipping', authenticate, verifyShippingAddress);

module.exports = router;
