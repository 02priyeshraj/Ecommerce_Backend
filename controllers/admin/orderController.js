const Order = require('../../models/orderModel');

//  Get All Orders with Optional Status Filter
exports.getAllOrders = async (req, res) => {
  const { status } = req.query;

  try {
    const filters = status ? { status } : {};
    const orders = await Order.find(filters)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price');

    res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order details retrieved successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Manage Delivery Agent
exports.manageDeliveryAgent = async (req, res) => {
  const { orderId } = req.params;
  const { name, contact } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryAgent: { name, contact } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Delivery agent details updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery agent details', error: error.message });
  }
};

// Update Tracking Details
exports.updateTrackingDetails = async (req, res) => {
  const { orderId } = req.params;
  const { estimatedDelivery, processingDate, shippedDate, outForDeliveryDate, deliveredDate } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          'trackingDetails.estimatedDelivery': estimatedDelivery,
          'trackingDetails.processingDate': processingDate,
          'trackingDetails.shippedDate': shippedDate,
          'trackingDetails.outForDeliveryDate': outForDeliveryDate,
          'trackingDetails.deliveredDate': deliveredDate,
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Tracking details updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tracking details', error: error.message });
  }
};

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  if (!['Paid', 'Unpaid'].includes(paymentStatus)) {
    return res.status(400).json({ message: 'Invalid payment status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status: 'Cancelled' }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};
