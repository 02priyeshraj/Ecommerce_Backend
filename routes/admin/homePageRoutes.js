const express = require('express');
const {
  addBanner,
  editBanner,
  removeBanner,
  getActiveBanners,
  getAllBanners,
  addTopCategory,
  editTopCategory,
  removeTopCategory,
  addBestSellingProducts,
  removeBestSellingProduct,
  getTopCategories, 
  getBestSellingProducts,  
} = require('../../controllers/admin/homePageController');
const authenticate = require('../../middlewares/authMiddleware');

const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Banner management
router.post('/banner', authenticate, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), addBanner);
router.put('/banner', authenticate, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), editBanner);
router.delete('/banner/:bannerId', authenticate, removeBanner);
router.get('/banners/active', authenticate, getActiveBanners);
router.get('/banners/all', authenticate, getAllBanners);


// Top categories management
router.post('/top-category', authenticate, addTopCategory);
router.put('/top-category', authenticate, editTopCategory);
router.delete('/top-category/:categoryId', authenticate, removeTopCategory);

// Best selling products management
router.post('/best-selling', authenticate, addBestSellingProducts);
router.delete('/best-selling/:productId', authenticate, removeBestSellingProduct);

// Get all top categories
router.get('/top-categories', authenticate, getTopCategories);

// Get all best-selling products
router.get('/best-selling', authenticate, getBestSellingProducts);

module.exports = router;
