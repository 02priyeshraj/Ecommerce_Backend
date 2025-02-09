const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String },
  image: { type: String, required: true },
  backgroundImage: { type: String }, 
  buttonText: { type: String },
  buttonLink: { type: String },
  isActive: { type: Boolean, default: true },
});

const homePageSchema = new mongoose.Schema({
  banners: [bannerSchema],
  topCategories: [
    {
      name: { type: String, required: true },
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
      isActive: { type: Boolean, default: true },
    },
  ],
  bestSellingProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  ],
}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema);
