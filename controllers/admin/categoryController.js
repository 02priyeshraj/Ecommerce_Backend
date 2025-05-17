const Category = require('../../models/categoryModel');
const { uploadToS3 } = require('../../helpers/awsUpload');


exports.addCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file, "category-images");
    }

    const category = new Category({ name, parent, image: imageUrl });
    await category.save();

    res.status(201).json({ message: 'Category added successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error: error.message });
  }
};


exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent } = req.body;

    let updateData = { name, parent };

    if (req.file) {
      updateData.image = await uploadToS3(req.file, "category-images");
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has subcategories
    const hasSubcategories = await Category.exists({ parent: id });
    if (hasSubcategories) {
      return res.status(400).json({ message: 'Cannot delete a category with subcategories' });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parent', 'name');
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};
