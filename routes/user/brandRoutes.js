const express = require('express');
const { getAllBrands } = require('../../controllers/user/brandController');
const router = express.Router();
router.get('/all',getAllBrands);
module.exports = router;