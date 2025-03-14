const express = require('express');
const multer = require('multer');
const {
  addProduct,
  editProduct,
  deleteProduct,
  setStock,
  assignDiscount,
  markProductUnavailable,
  getAllProducts,
  getProductByName,
  searchProductsByName,
  getProductsByBrand,
  getOverallRating,
  filterByBrand,
  filterByCategory,
  filterBySize,
  filterByColor


} = require('../../controllers/admin/productController');
const authenticate = require('../../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', authenticate, upload.array('images', 5), addProduct);
router.put('/edit/:id', authenticate, upload.array('images', 5), editProduct);
router.delete('/delete/:id', authenticate, deleteProduct);
router.patch('/set-stock/:id', authenticate, setStock);
router.patch('/assign-discount/:id', authenticate, assignDiscount);
router.patch('/mark-unavailable/:id', authenticate, markProductUnavailable);
router.get('/all', authenticate, getAllProducts);
router.get('/name/:name', authenticate, getProductByName);
router.get('/search', authenticate, searchProductsByName);
router.get('/brand/:brandId', authenticate, getProductsByBrand);
router.get('/rating/:id', authenticate, getOverallRating);
router.post('/filter/brand', authenticate, filterByBrand);
router.post('/filter/category', authenticate, filterByCategory);
router.post('/filter/size', authenticate, filterBySize);
router.post('/filter/color', authenticate, filterByColor);

module.exports = router;
