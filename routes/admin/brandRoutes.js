const express = require('express');
const multer = require('multer');
const { addBrand, getAllBrands , deleteBrand , updateBrand} = require('../../controllers/admin/brandController');
const authenticate = require('../../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', authenticate, upload.single('image'), addBrand);
router.get('/all', authenticate, getAllBrands);
router.delete('/delete/:id', authenticate, deleteBrand);
router.put("/update/:id", authenticate, upload.single("image"), updateBrand);


module.exports = router;