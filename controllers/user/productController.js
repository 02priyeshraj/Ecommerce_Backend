const Product = require('../../models/productModel');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate('category', 'name');
    res.status(200).json({message: 'Products fetched successfully.', products : products});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
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
const getProductByName = async (req, res) => {
  const { name } = req.params;
  try {
    const products = await Product.find({ name: new RegExp(name, 'i'), isActive: true });
    res.status(200).json({message: 'Products fetched successfully.', products : products});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

// Get products by similar keywords
const getProductsByKeywords = async (req, res) => {
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

// Get products by category
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId, isActive: true });
    res.status(200).json({message: 'Products fetched successfully.', products : products});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

const getProductsByBrand = async (req, res) => {
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
const filterProducts = async (req, res) => {
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
const rateProduct = async (req, res) => {
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

module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  getProductsByKeywords,
  getProductsByCategory,
  getProductsByBrand,
  filterProducts,
  rateProduct,
};
