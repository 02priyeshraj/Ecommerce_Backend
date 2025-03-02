const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductByName,
  getProductsByKeywords,
  getProductsByCategory,
  getProductsByBrand,
  filterProducts,
  rateProduct,
  getOverallRating,
  filterByBrand,
  filterByCategory,
  filterBySize,
  filterByColor,
  searchEcommerce,
  getSimilarProducts
} = require('../../controllers/user/productController');

const authenticate = require('../../middlewares/authMiddleware');

const router = express.Router();

// Public APIs
router.get('/all', getAllProducts);
router.get('/id/:id', getProductById);
router.get('/name/:name', getProductByName);
router.get('/search', getProductsByKeywords);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/brand/:brandId', getProductsByBrand);
router.get('/filter', filterProducts);


router.get('/rating/:id', getOverallRating);
router.get('/similar/:id', getSimilarProducts);


// Filter APIs (POST since we're sending filters in request body)
router.post('/filter/brand', filterByBrand);
router.post('/filter/category', filterByCategory);
router.post('/filter/size', filterBySize);
router.post('/filter/color', filterByColor);
router.get('/search-ecommerce', searchEcommerce);

// Protected API
router.post('/rate/:id', authenticate, rateProduct);

module.exports = router;
