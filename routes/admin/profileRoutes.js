const express = require('express');
const {
  updateProfileDetails,
  updateCredentials,
} = require('../../controllers/admin/profileController');
const authenticate = require('../../middlewares/authMiddleware'); // Ensure the admin is authenticated

const router = express.Router();


router.put('/profile', authenticate, updateProfileDetails);
router.put('/profile/credentials', authenticate, updateCredentials);

module.exports = router;
