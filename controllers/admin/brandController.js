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

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if brand exists
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Delete the brand
    await Brand.findByIdAndDelete(id);

    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting brand', error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let imageUrl = null;

    // Check if the brand exists
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Upload new image if provided
    if (req.file) {
      imageUrl = await uploadToS3(req.file, "brand-images");
    }

    // Update brand details
    brand.name = name || brand.name;
    brand.image = imageUrl || brand.image;
    await brand.save();

    res.status(200).json({ message: "Brand updated successfully", brand });
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error: error.message });
  }
};

