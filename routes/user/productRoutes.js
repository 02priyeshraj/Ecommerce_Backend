const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductByName,
  getProductsByKeywords,
  getProductsByCategory,
  filterProducts,
  rateProduct,
} = require('../../controllers/user/productController');
const authenticate = require('../../middlewares/authMiddleware');

const router = express.Router();

// Public APIs
router.get('/all', getAllProducts);
router.get('/id/:id', getProductById);
router.get('/name/:name', getProductByName);
router.get('/search', getProductsByKeywords);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/filter', filterProducts);

// Protected API
router.post('/rate/:id', authenticate, rateProduct);

module.exports = router;
