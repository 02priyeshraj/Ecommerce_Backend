const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }, // Stores price at the time of adding
    },
  ],
  totalPrice: { type: Number, default: 0 }, // Auto-calculated
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
