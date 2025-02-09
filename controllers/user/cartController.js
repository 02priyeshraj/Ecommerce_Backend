const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');

// Utility function to calculate total price
const calculateTotalPrice = (cart) => {
  return cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
};

// 1. Get User Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) return res.status(200).json({ message: "Cart is empty", items: [] });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

// 2. Add Item to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: "Product not found or inactive" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [{ productId, quantity, price: product.price }] });
    } else {
      const item = cart.items.find(item => item.productId.toString() === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price: product.price });
      }
    }

    cart.totalPrice = calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: 'Error adding item' });
  }
};

// 3. Update Item Quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity > 0 ? quantity : 1;
    cart.totalPrice = calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ error: 'Error updating quantity' });
  }
};

// 4. Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalPrice = calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ error: 'Error removing item' });
  }
};

// 5. Checkout (Redirect to checkout page)
exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    res.status(200).json({ message: "Proceed to checkout", cart });
  } catch (error) {
    res.status(500).json({ error: 'Error during checkout' });
  }
};

// 6. Get Product Recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "No recommendations", recommendations: [] });
    }

    // Extract category IDs from cart items
    const categoryIds = cart.items
      .map(item => item.productId?.category)
      .filter(category => category); // Remove undefined values

    console.log("Fetching recommendations for categories:", categoryIds);

    if (categoryIds.length === 0) {
      return res.status(200).json({ message: "No recommendations", recommendations: [] });
    }

    // Find products in those categories excluding the ones already in cart
    const recommendedProducts = await Product.find({
      category: { $in: categoryIds },
      isActive: true,
      _id: { $nin: cart.items.map(item => item.productId._id) } // Exclude already added products
    }).limit(5);

    res.status(200).json({ recommendations: recommendedProducts });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: 'Error fetching recommendations' });
  }
};

