const Notification = require('../../models/notificationModel');

// Get All Active Notifications
exports.getActiveNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isActive: true }).sort({ sentAt: -1 });

    res.status(200).json({
      message: 'Active notifications retrieved successfully',
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};
