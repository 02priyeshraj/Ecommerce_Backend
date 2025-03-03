const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  checkout,
  getRecommendations,
  deleteItemFromCart
} = require('../../controllers/user/cartController');

const router = express.Router();

router.get('/', authenticate, getCart); // Get Cart
router.post('/add', authenticate, addToCart); // Add Item to Cart
router.put('/update', authenticate, updateQuantity); // Update Quantity
router.delete('/remove/:productId', authenticate, removeFromCart); // Remove Item
router.get('/checkout', authenticate, checkout); // Checkout
router.get('/recommendations', authenticate, getRecommendations); // Recommendations
router.delete('/delete/:productId', authenticate, deleteItemFromCart); // Delete Item

module.exports = router;
