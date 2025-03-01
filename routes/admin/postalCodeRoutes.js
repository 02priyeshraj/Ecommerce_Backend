const express = require('express');
const authenticate= require('../../middlewares/authMiddleware');
const {
  createPostalCode,
  getAllPostalCodes,
  getPostalCodesByZipCode,
  getPostalCodesByBranch,
  getPostalCodesBySubordinate,
} = require('../../controllers/admin/postalCodeController');

const router = express.Router();

// Define routes
router.post('/create', authenticate, createPostalCode);
router.get('/all', authenticate, getAllPostalCodes);
router.get('/zip/:ZipCode', authenticate, getPostalCodesByZipCode);
router.get('/branch/:branch', authenticate, getPostalCodesByBranch);
router.get('/subordinate/:subordinate', authenticate, getPostalCodesBySubordinate);

module.exports = router;
