const mongoose = require('mongoose');

const returnExchangeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['Return', 'Exchange'], required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
    requestDate: { type: Date, default: Date.now },
    resolvedDate: { type: Date },
    refundMethod: { type: String, enum: ['Original Payment Method', 'Saved Bank Account'], required: true },
    exchangeProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

    // Bank Details (Only for Return Requests)
    bankDetails: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReturnExchange', returnExchangeSchema);
