const mongoose = require('mongoose');

// First check if the model already exists to prevent recompilation
const ProcessingBatch = mongoose.models.ProcessingBatch || mongoose.model('ProcessingBatch', new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  neeraRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Neera', required: true },
  currentStage: { type: String, default: 'Initial' },
  stageLogs: [{
    stage: { type: String },
    notes: { type: String },
    updatedBy: { type: String },
    timestamp: { type: Date, default: Date.now },
    startTime: { type: Date },
    endTime: { type: Date },
    temperatureCelsius: { type: Number },
    outputLiters: { type: Number },
    wastageLiters: { type: Number }
  }],
  stageCompleted: {
    type: Boolean,
    default: false
  },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  addedToInventory: { type: Boolean, default: false },
  addedToInventoryAt: Date
}, { timestamps: true }));

module.exports = ProcessingBatch;
