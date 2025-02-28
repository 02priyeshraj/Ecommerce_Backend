const Category = require('../../models/categoryModel');
const mongoose = require('mongoose');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: 'Categories retrieved successfully', categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category retrieved successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

exports.getParentCategories = async (req, res) => {
  try {
    const parentCategories = await Category.find({ $or: [{ parent: null }, { parent: { $exists: false } }] });
    res.status(200).json({ message: 'Parent categories retrieved successfully', categories: parentCategories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parent categories', error: error.message });
  }
};


// Get children categories of a given parent category
exports.getChildCategories = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: 'Invalid parent category ID' });
    }

    const childCategories = await Category.find({ parent: parentId });
    res.status(200).json({ message: 'Child categories retrieved successfully', categories: childCategories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching child categories', error: error.message });
  }
};

exports.searchCategories = async (req, res) => {
  try {
    let { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const categories = await Category.find({ name: { $regex: query.trim(), $options: 'i' } });

    res.status(200).json({
      message: 'Categories retrieved successfully',
      categories
    });
  } catch (error) {
    console.error("Error searching categories:", error);
    res.status(500).json({ message: 'Error searching categories', error: error.message });
  }
};

