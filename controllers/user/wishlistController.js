const Wishlist = require('../../models/wishlistModel');
const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');

//1. Get User Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('items.productId');
    if (!wishlist) return res.status(200).json({ message: "Wishlist is empty", items: [] });

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching wishlist' });
  }
};

//2. Add Item to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [{ productId }] });
    } else {
      const exists = wishlist.items.some(item => item.productId.toString() === productId);
      if (exists) return res.status(400).json({ message: "Item already in wishlist" });

      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.status(200).json({ message: "Item added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: 'Error adding to wishlist' });
  }
};

//3. Remove Item from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    // Use `$pull` to remove the item from the array
    await Wishlist.updateOne(
      { userId: req.user.id },
      { $pull: { items: { productId: productId } } }
    );

    // Fetch updated wishlist
    const updatedWishlist = await Wishlist.findOne({ userId: req.user.id }).populate('items.productId');

    res.status(200).json({ message: "Item removed from wishlist", wishlist: updatedWishlist });
  } catch (error) {
    res.status(500).json({ error: 'Error removing item', details: error.message });
  }
};

// 4. Delete Item from Wishlist (Remove product completely)
exports.deleteItemFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    // Filter out the item completely
    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

    await wishlist.save();

    res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: "Error removing item from wishlist", details: error.message });
  }
};

// 5. Move Item from Wishlist to Cart
exports.moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch the product and check if it exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Fetch user's wishlist
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    // Find item in wishlist
    const itemIndex = wishlist.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(400).json({ message: "Item not found in wishlist" });

    // Remove from Wishlist
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    // Fetch user's cart
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, quantity: 1, price: product.price }],
      });
    } else {
      if (!cart.items) cart.items = []; // Ensure items array exists
      const cartItem = cart.items.find(item => item.productId.toString() === productId);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1, price: product.price });
      }
    }

    // Recalculate totalPrice
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();

    res.status(200).json({ message: "Item moved to cart", wishlist, cart });

  } catch (error) {
    console.error("Error moving item to cart:", error);
    res.status(500).json({ error: 'Error moving item to cart', details: error.message });
  }
};



