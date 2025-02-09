const express = require('express');
const {getActiveNotifications} = require('../../controllers/user/notificationController');

const router = express.Router();

router.get('/notifications', getActiveNotifications);

module.exports = router;
