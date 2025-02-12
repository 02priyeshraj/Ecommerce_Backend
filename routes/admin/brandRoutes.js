const express = require('express');
const multer = require('multer');
const { addBrand, getAllBrands } = require('../../controllers/admin/brandController');
const authenticate = require('../../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', authenticate, upload.single('image'), addBrand);
router.get('/all', authenticate, getAllBrands);

module.exports = router;