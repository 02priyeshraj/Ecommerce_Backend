const Order = require('../../models/orderModel');
const User = require('../../models/userModel');
const Cart = require('../../models/cartModel');

exports.placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, name, phone } = req.body;

    // Ensure user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure cart exists and is not empty
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Ensure address exists
    const address = user.addresses.find(addr => addr._id.toString() === addressId);
    if (!address) {
      return res.status(400).json({ message: "Invalid or missing address" });
    }

    // Validate name and phone from user input
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Create new order
    const newOrder = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount: cart.totalPrice,
      shippingAddress: {
        name, // User input
        phone, // User input
        street: address.street,
        city: address.city,
        district: address.district,
        subordinate: address.subordinate,
        branch: address.branch,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      },
      paymentStatus: paymentMethod === "COD" ? "Unpaid" : "Paid",
    });

    await newOrder.save();

    // Link order to user
    user.ordersPlaced.push(newOrder._id);
    await user.save();

    // Clear the cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: 'Error placing order' });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id }).populate('items.productId');
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order details' });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelling order' });
  }
};


exports.getAllAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching addresses' });
  }
};
