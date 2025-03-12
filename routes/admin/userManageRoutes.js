const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
    getAllUsers,
    getUserById,
    searchUserByName,
    updateUser,
    disableUser,
    enableUser
} = require('../../controllers/admin/userManageController');

const router = express.Router();

router.get('/users', authenticate, getAllUsers);
router.get('/users/search', authenticate, searchUserByName);
router.get('/users/:userId', authenticate, getUserById);
router.put('/users/:userId', authenticate, updateUser);
router.put('/users/:userId/disable', authenticate, disableUser);
router.put('/users/:userId/enable', authenticate, enableUser);


module.exports = router;
