const Product = require('../../models/productModel');
const { uploadToS3 } = require('../../helpers/awsUpload');

const calculateDiscountedPrice = (MRP, discountPercentage) => {
  return MRP - (MRP * discountPercentage) / 100;
};

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, brand, MRP, price, stock, specifications, discount, keywords } = req.body;

    let imageUrls = [];
    if (req.files) {
      imageUrls = await Promise.all(req.files.map(file => uploadToS3(file, "product-images")));
    }

    const discountedPrice = discount ? calculateDiscountedPrice(MRP, discount.percentage) : MRP;

    // Ensure specifications is stored as a Map
    const parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const specificationsMap = new Map(Object.entries(parsedSpecifications || {}));

    const product = new Product({
      name,
      description,
      category,
      brand,
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
    const updateData = {};
    
    // Fetch existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Only update fields that are provided in req.body
    const fieldsToUpdate = ['name', 'description', 'category', 'brand', 'MRP', 'price', 'stock', 'keywords'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Update specifications if provided
    if (req.body.specifications) {
      const parsedSpecifications = typeof req.body.specifications === 'string' 
        ? JSON.parse(req.body.specifications) 
        : req.body.specifications;
      updateData.specifications = new Map(Object.entries(parsedSpecifications || {}));
    }

    // Update discount if provided
    if (req.body.discount) {
      updateData.discount = req.body.discount;
      updateData.discountedPrice = calculateDiscountedPrice(
        updateData.MPR || existingProduct.MRP, 
        req.body.discount.percentage
      );
    }

    // Handle image upload if new files are provided
    if (req.files && req.files.length > 0) {
      updateData.images = await Promise.all(req.files.map(file => uploadToS3(file, "product-images")));
    }
    
    // If stock is updated, update isActive status accordingly
    if (updateData.stock !== undefined) {
      updateData.isActive = updateData.stock > 0;
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
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
    product.discountedPrice = calculateDiscountedPrice(product.MRP, percentage);

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
