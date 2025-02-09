const express = require('express');
const multer = require('multer');
const {
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
} = require('../../controllers/admin/categoryController');
const authenticate = require('../../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', authenticate, upload.single('image'), addCategory);
router.put('/edit/:id', authenticate, upload.single('image'), editCategory);
router.delete('/delete/:id', authenticate, deleteCategory);
router.get('/', authenticate, getAllCategories);

module.exports = router;
