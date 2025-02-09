const User = require('../../models/userModel');
const bcrypt = require('bcrypt');

// Update admin profile details
exports.updateProfileDetails = async (req, res) => {
  const adminId = req.user.id; // Assuming the admin is authenticated, and their ID is attached to the request
  const { name, email, phone } = req.body;

  try {
    const admin = await User.findById(adminId);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.phone = phone || admin.phone;

    await admin.save();

    res.status(200).json({
      message: 'Admin profile updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Update admin credentials (password)
exports.updateCredentials = async (req, res) => {
  const adminId = req.user.id; // Assuming the admin is authenticated, and their ID is attached to the request
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await User.findById(adminId);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    await admin.save();

    res.status(200).json({ message: 'Admin password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};
