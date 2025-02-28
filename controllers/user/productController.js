const Product = require('../../models/productModel');
const mongoose = require('mongoose');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate('category', 'name');
    res.status(200).json({message: 'Products fetched successfully.', products : products});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({message: 'Product fetched successfully.', product : product});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

// Get product by name
exports.getProductByName = async (req, res) => {
  const { name } = req.params;
  try {
    const products = await Product.find({ name: new RegExp(name, 'i'), isActive: true });
    res.status(200).json({message: 'Products fetched successfully.', products : products});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

// Get products by similar keywords
exports.getProductsByKeywords = async (req, res) => {
  const { query } = req.query; // e.g., /search?query=shoes
  try {
    const products = await Product.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { keywords: new RegExp(query, 'i') },
      ],
      isActive: true,
    });
    res.status(200).json({message: 'Products fetched successfully.', products : products});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Get products by category (with category details)
exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId, isActive: true })
      .populate('category'); // Fetch category details

    res.status(200).json({
      message: 'Products fetched successfully.',
      products: products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};


exports.getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const products = await Product.find({ brand: brandId }).populate('category brand');

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this brand' });
    }

    res.status(200).json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by brand', error: error.message });
  }
};


// Filter products
exports.filterProducts = async (req, res) => {
  const filters = req.query; // e.g., /filter?category=123&brand=Nike
  try {
    const query = { isActive: true };
    if (filters.category) query.category = filters.category;
    if (filters.brand) query['specifications.brand'] = new RegExp(filters.brand, 'i');

    const products = await Product.find(query);
    res.status(200).json({message: 'Products fetched successfully.', products : products});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Rate a product
exports.rateProduct = async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  const userId = req.user.id; // Assuming user ID from the middleware

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existingRating = product.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      // Add new rating
      product.ratings.push({ userId, rating, review });
    }

    await product.save();
    res.status(200).json({ message: 'Product rated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to rate product', error });
  }
};


// Get overall rating of a product
exports.getOverallRating = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.ratings.length === 0) {
      return res.status(200).json({ message: 'No ratings yet', overallRating: 0 });
    }

    const totalRating = product.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const overallRating = totalRating / product.ratings.length;

    res.status(200).json({ message: 'Overall rating fetched successfully', overallRating: overallRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch overall rating', error });
  }
};

// Filter products by brand
exports.filterByBrand = async (req, res) => {
  try {
    const { brands } = req.body; // Expecting an array or single brand ID
    const filter = {};

    if (brands) {
      filter.brand = { $in: Array.isArray(brands) ? brands : [brands] };
    }

    const products = await Product.find(filter).populate('category brand');
    res.status(200).json({ message: 'Filtered products by brand', products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter products by brand', error });
  }
};

// Filter products by categories
exports.filterByCategory = async (req, res) => {
  try {
    const { categories } = req.body; // Expecting an array or single category ID
    const filter = {};

    if (categories) {
      filter.category = { $in: Array.isArray(categories) ? categories : [categories] };
    }

    const products = await Product.find(filter).populate('category brand');
    res.status(200).json({ message: 'Filtered products by category', products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter products by category', error });
  }
};

// Filter products by size
exports.filterBySize = async (req, res) => {
  try {
    const { sizes } = req.body; // Expecting an array or single size
    const filter = {};

    if (sizes) {
      filter['specifications.size'] = { $in: Array.isArray(sizes) ? sizes : [sizes] };
    }

    const products = await Product.find(filter).populate('category brand');
    res.status(200).json({ message: 'Filtered products by size', products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter products by size', error });
  }
};

// Filter products by color
exports.filterByColor = async (req, res) => {
  try {
    const { colors } = req.body; // Expecting an array or single color
    const filter = {};

    if (colors) {
      filter['specifications.color'] = { $in: Array.isArray(colors) ? colors : [colors] };
    }

    const products = await Product.find(filter).populate('category brand');
    res.status(200).json({ message: 'Filtered products by color', products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter products by color', error });
  }
};

