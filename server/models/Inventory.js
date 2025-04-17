// models/Inventory.js
const mongoose = require('mongoose');

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  productType: { 
    type: String, 
    enum: ['Jaggery Powder', 'Jaggery Block', 'Liquid Sugar'],
    required: true 
  },
  netWeightKg: { type: Number, required: true },
  unitsPacked: { type: Number, required: true },
  packagingType: { type: String },
  storageLocation: { type: String },
  qualityGrade: { type: String },
  expirationDate: { type: Date },
  processingBatchRef: { type: mongoose.Schema.Types.ObjectId, ref: 'ProcessingBatch', required: true }
}, { timestamps: true }));

module.exports = Inventory;