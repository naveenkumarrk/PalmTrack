// models/Neera.js
const mongoose = require('mongoose');

const neeraSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  collectionDate: { type: Date, required: true },
  batchId: { type: String, required: true, unique: true },
  quantityLiters: { type: Number, required: true },
  collectionMethod: { type: String },
  storageTank: { type: String },
  temperatureCelsius: { type: Number },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Collected', 'Processing', 'Completed'],
    default: 'Collected'
  }
}, { timestamps: true });

module.exports = mongoose.model('Neera', neeraSchema);
