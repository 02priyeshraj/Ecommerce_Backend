const Brand = require('../../models/brandModel');
const { uploadToS3 } = require('../../helpers/awsUpload');

exports.addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToS3(req.file, 'brand-images');
    }

    const brand = new Brand({ name, image: imageUrl });
    await brand.save();

    res.status(201).json({ message: 'Brand added successfully', brand });
  } catch (error) {
    res.status(500).json({ message: 'Error adding brand', error: error.message });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ message: 'Brands retrieved successfully', brands });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
};
