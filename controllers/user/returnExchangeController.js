const ReturnExchange = require('../../models/returnExchangeModel');
const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');

// Request Return or Exchange
exports.requestReturnExchange = async (req, res) => {
  const { orderId, productId, type, reason, refundMethod, exchangeProductId } = req.body;
  const userId = req.user.id;

  try {
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Order not found or does not belong to user' });
    }

    // Check if product exists in order
    const productInOrder = order.items.find((item) => item.productId.toString() === productId);
    if (!productInOrder) {
      return res.status(400).json({ message: 'Product not found in order' });
    }

    // Check if order is delivered and within 14 days
    if (!order.trackingDetails?.deliveredDate || new Date() - order.trackingDetails.deliveredDate > 14 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Return/Exchange request must be within 14 days of delivery' });
    }

    if (type === 'Exchange' && !exchangeProductId) {
      return res.status(400).json({ message: 'Exchange product ID required' });
    }

    const newRequest = await ReturnExchange.create({
      userId,
      orderId,
      productId,
      type,
      reason,
      refundMethod,
      exchangeProductId: type === 'Exchange' ? exchangeProductId : null,
    });

    res.status(201).json({ message: `${type} request submitted successfully`, request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

//  Get User’s Return/Exchange Requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await ReturnExchange.find({ userId: req.user.id }).populate('productId orderId exchangeProductId');
    res.status(200).json({ message: 'Requests retrieved successfully', requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

//  Cancel Return/Exchange Request
exports.cancelRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await ReturnExchange.findById(requestId);
    if (!request || request.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Request not found or unauthorized' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending requests can be canceled' });
    }

    await ReturnExchange.findByIdAndDelete(requestId);
    res.status(200).json({ message: 'Request canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling request', error: error.message });
  }
};
