const express = require('express');
const {
  updateProfileDetails,
  updateCredentials,
} = require('../../controllers/admin/profileController');
const authenticate = require('../../middlewares/authMiddleware'); // Ensure the admin is authenticated

const router = express.Router();

// Update admin personal details
router.put('/profile', authenticate, updateProfileDetails);

// Update admin credentials (password)
router.put('/profile/credentials', authenticate, updateCredentials);

module.exports = router;
