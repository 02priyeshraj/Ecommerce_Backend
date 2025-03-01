const mongoose = require('mongoose');

const postalCodeSchema = new mongoose.Schema({
  district: { type: String, required: true },
  subordinate: { type: String, required: true },
  branch: { type: String, required: true },
  ZipCode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PostalCode', postalCodeSchema);
