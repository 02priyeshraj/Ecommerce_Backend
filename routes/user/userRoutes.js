const express = require('express');
const authenticate= require('../../middlewares/authMiddleware');
const {
  signup,
  login,
  updatePersonalDetails,
  addAddress,
  editAddress,
  removeAddress,
  changePassword,
  logout
} = require('../../controllers/user/userController');

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Routes
router.put('/update', authenticate, updatePersonalDetails);
router.post('/address/add', authenticate, addAddress);
router.put('/address/edit/:addressId', authenticate, editAddress);
router.delete('/address/remove/:addressId', authenticate, removeAddress);
router.put('/change-password', authenticate, changePassword);
router.post('/logout', authenticate, logout);

module.exports = router;
