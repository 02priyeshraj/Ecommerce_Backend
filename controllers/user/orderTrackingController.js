const Order = require('../../models/orderModel');

// Get All Orders of Logged-in User
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Track a Specific Order by ID
exports.trackOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order details retrieved',
      order: {
        orderId: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        trackingDetails: order.trackingDetails,
        estimatedDelivery: order.trackingDetails.estimatedDelivery,
        deliveryAgent: order.deliveryAgent,
        shippingAddress: order.shippingAddress,
        orderDate: order.orderDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// Get Live Order Status
exports.getOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status retrieved',
      orderId: order._id,
      status: order.status,
      trackingDetails: order.trackingDetails,
      estimatedDelivery: order.trackingDetails.estimatedDelivery,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order status', error: error.message });
  }
};
