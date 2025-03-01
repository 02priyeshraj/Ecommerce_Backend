const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      name: { type: String, required: true },  // User input
      phone: { type: String, required: true }, // User input
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      subordinate: { type: String, required: true },
      branch: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    deliveryAgent: {
      name: { type: String },
      contact: { type: String },
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    trackingDetails: {
      estimatedDelivery: { type: Date },
      processingDate: { type: Date },
      shippedDate: { type: Date },
      outForDeliveryDate: { type: Date },
      deliveredDate: { type: Date },
    },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
