// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  productType: { type: String, enum: ['Jaggery Block', 'Jaggery Powder', 'Liquid Sugar'], required: true },
  netWeightKg: { type: Number, required: true },
  unitsPacked: { type: Number, required: true },
  packagingType: { type: String },
  storageLocation: { type: String },
  qualityGrade: { type: String },
  expirationDate: { type: Date },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
