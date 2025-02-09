const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    MRP: { type: Number, required: true },
    discountedPrice: { type: Number },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String, required: true }],
    discount: {
      percentage: { type: Number, default: 0 },
      validTill: { type: Date },
    },
    isActive: { type: Boolean, default: true },
    specifications: { type: Map, of: String , default: new Map() },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        review: { type: String },
      },
    ],
    keywords: { type: [String], default: [] }, // for better searchability
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
