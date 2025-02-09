const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
    getAllUsers,
    getUserById,
    searchUserByName,
    updateUser,
    disableUser
} = require('../../controllers/admin/userManageController');

const router = express.Router();

router.get('/users', authenticate, getAllUsers);
router.get('/users/:userId', authenticate, getUserById);
router.get('/users/search', authenticate, searchUserByName);
router.put('/users/:userId', authenticate, updateUser);
router.put('/users/:userId/disable', authenticate, disableUser);

module.exports = router;
