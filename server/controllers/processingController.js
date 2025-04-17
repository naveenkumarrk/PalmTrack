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

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await ProcessingBatch.find()
      .populate('neeraRef') // this is a likely failure point
      .sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    console.error('❌ Failed to fetch batches:', err); // LOG THIS
    res.status(500).json({ error: 'Failed to fetch batches', details: err.message });
  }
};


exports.updateStage = async (req, res) => {
  try {
    const { batchId } = req.params;
    const log = {
      ...req.body,
      updatedBy: req.user?.id || 'system'
    };

    const batch = await ProcessingBatch.findOne({ batchId });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    batch.stageLogs.push(log);
    batch.currentStage = log.stage;

    // ✅ Auto-mark stageCompleted when last stage is reached
    if (log.stage === 'Packing') {
      batch.stageCompleted = true;
    }

    await batch.save();

    res.json({ message: 'Stage updated', batch });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update stage', details: err.message });
  }
};

exports.completeBatch = async (req, res) => {
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


// Add this function to your processing batch controller
exports.updateInventoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { addedToInventory } = req.body;
    
    const processingBatch = await ProcessingBatch.findById(id);
    
    if (!processingBatch) {
      return res.status(404).json({ error: 'Processing batch not found' });
    }
    
    processingBatch.addedToInventory = addedToInventory;
    
    if (addedToInventory) {
      processingBatch.addedToInventoryAt = new Date();
    } else {
      processingBatch.addedToInventoryAt = null;
    }
    
    await processingBatch.save();
    
    res.status(200).json({ 
      message: 'Processing batch inventory status updated',
      batch: processingBatch 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to update processing batch inventory status', 
      details: err.message 
    });
  }
};