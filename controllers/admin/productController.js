const Product = require('../../models/productModel');
const { uploadToS3 } = require('../../helpers/awsUpload');

const calculateDiscountedPrice = (price, discountPercentage) => {
  return price - (price * discountPercentage) / 100;
};

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, MRP, price, stock, specifications, discount, keywords } = req.body;

    let imageUrls = [];
    if (req.files) {
      imageUrls = await Promise.all(req.files.map(file => uploadToS3(file, "product-images")));
    }

    const discountedPrice = discount ? calculateDiscountedPrice(price, discount.percentage) : price;

    // Ensure specifications is stored as a Map
    const parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const specificationsMap = new Map(Object.entries(parsedSpecifications || {}));

    const product = new Product({
      name,
      description,
      category,
      MRP,
      price,
      stock,
      images: imageUrls,
      specifications: specificationsMap,
      discount,
      discountedPrice,
      keywords,
      isActive: stock > 0 // Set isActive based on stock availability
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Edit a product
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, MRP, price, stock, specifications, discount, keywords} = req.body;

    let updateData = { name, description, category, MRP, price, stock, keywords };

    if (specifications) {
      const parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      updateData.specifications = new Map(Object.entries(parsedSpecifications || {}));
    }

    if (discount) {
      updateData.discountedPrice = calculateDiscountedPrice(price, discount.percentage);
      updateData.discount = discount;
    }

    if (req.files && req.files.length > 0) {
      updateData.images = await Promise.all(req.files.map(file => uploadToS3(file, "product-images")));
    }

    updateData.isActive = stock > 0; // Update isActive based on stock

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Set stock for a product
exports.setStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(id, { stock, isActive: stock > 0 }, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};

// Assign discount to a product
exports.assignDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { percentage, validTill } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.discount = { percentage, validTill };
    product.discountedPrice = calculateDiscountedPrice(product.price, percentage);

    await product.save();
    res.status(200).json({ message: 'Discount assigned successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning discount', error: error.message });
  }
};

// Mark product as unavailable
exports.markProductUnavailable = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product marked as unavailable', product });
  } catch (error) {
    res.status(500).json({ message: 'Error marking product unavailable', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get product by name (case-insensitive)
exports.getProductByName = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.findOne({ name: new RegExp(`^${name}$`, 'i') });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product retrieved successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Search products by name (partial match)
exports.searchProductsByName = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({ name: new RegExp(query, 'i') });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};
