const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} = require('../../controllers/user/wishlistController');

const router = express.Router();

router.get('/', authenticate, getWishlist); // Get Wishlist
router.post('/add', authenticate, addToWishlist); // Add Item to Wishlist
router.delete('/remove/:productId', authenticate, removeFromWishlist); // Remove Item from Wishlist
router.post('/move-to-cart/:productId', authenticate, moveToCart); // Move Item to Cart

module.exports = router;
