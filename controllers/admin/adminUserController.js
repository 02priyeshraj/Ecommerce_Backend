const User = require('../../models/userModel');

// View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).populate('ordersPlaced');
    res.status(200).json({ message: 'Users retrieved successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true }
    );

    if (!user || user.role !== 'user') {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details', error: error.message });
  }
};

// Disable user account
exports.disableUserAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isDisabled: true },
      { new: true }
    );

    if (!user || user.role !== 'user') {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User account disabled successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error disabling user account', error: error.message });
  }
};
