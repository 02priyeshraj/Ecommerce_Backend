const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  getParentCategories,
  getChildCategories,
  searchCategories
} = require('../../controllers/user/categoryController');

const router = express.Router();

// Static routes should be defined first
router.get('/all', getAllCategories);
router.get('/parents', getParentCategories);
router.get('/search', searchCategories);

// Routes with parameters should be placed after static routes
router.get('/children/:parentId', getChildCategories);
router.get('/:id', getCategoryById);  // Keep this last

module.exports = router;
