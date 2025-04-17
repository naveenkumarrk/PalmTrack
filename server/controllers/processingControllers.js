// controllers/processingController.js
const ProcessingBatch = require('../models/ProcessingBatch');
const Neera = require('../models/Neera');

exports.createProcessingBatch = async (req, res) => {
  try {
    const { batchId, neeraRef } = req.body;

    const neeraExists = await Neera.findById(neeraRef);
    if (!neeraExists) return res.status(404).json({ error: 'Neera entry not found' });

    const newBatch = new ProcessingBatch({
      batchId,
      neeraRef
    });

    await newBatch.save();
    res.status(201).json({ message: 'Processing batch created', batch: newBatch });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create batch', details: err.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const { batchId } = req.params;
    const log = {
      ...req.body,
      updatedBy: req.user.id
    };

    const batch = await ProcessingBatch.findOne({ batchId });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    batch.stageLogs.push(log);
    batch.currentStage = log.stage;
    await batch.save();

    res.json({ message: 'Stage updated', batch });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update stage', details: err.message });
  }
};

exports.completeBatch = async (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Only managers can complete batches' });
  }

  try {
    const { batchId } = req.params;
    const batch = await ProcessingBatch.findOne({ batchId });

    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    batch.isCompleted = true;
    batch.currentStage = 'Completed';
    batch.completedAt = new Date();
    await batch.save();

    res.json({ message: 'Batch marked as completed', batch });
  } catch (err) {
    res.status(400).json({ error: 'Failed to complete batch', details: err.message });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await ProcessingBatch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
};