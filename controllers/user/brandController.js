const Brand = require('../../models/brandModel');

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ message: 'Brands retrieved successfully', brands });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
};
