// controllers/inventoryController.js
const Inventory = require('../models/Inventory');
const ProcessingBatch = require('../models/ProcessingBatch');

exports.addInventory = async (req, res) => {
  try {
    const {
      batchId,
      productType,
      netWeightKg,
      unitsPacked,
      packagingType,
      storageLocation,
      qualityGrade,
      expirationDate,
      processingBatchRef
    } = req.body;

    console.log('Received inventory data:', req.body);

    // Validate required fields
    if (!batchId || !productType || !netWeightKg || !unitsPacked || !processingBatchRef) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          batchId: !batchId ? 'Required' : undefined,
          productType: !productType ? 'Required' : undefined,
          netWeightKg: !netWeightKg ? 'Required' : undefined,
          unitsPacked: !unitsPacked ? 'Required' : undefined,
          processingBatchRef: !processingBatchRef ? 'Required' : undefined
        }
      });
    }

    // Check if processing batch exists
    const processingBatch = await ProcessingBatch.findById(processingBatchRef);
    if (!processingBatch) {
      return res.status(404).json({ error: 'Processing batch not found' });
    }

    // Check if batch is already added to inventory
    if (processingBatch.addedToInventory) {
      return res.status(400).json({ error: 'This batch has already been added to inventory' });
    }

    // Create new inventory object
    const newInventory = new Inventory({
      batchId,
      productType,
      netWeightKg: parseFloat(netWeightKg), // Ensure numeric data type
      unitsPacked: parseInt(unitsPacked, 10), // Ensure numeric data type
      packagingType,
      storageLocation,
      qualityGrade,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      processingBatchRef
    });

    // Save to database
    await newInventory.save();
    
    // Mark processing batch as added to inventory (this will be handled by separate endpoint)
    
    res.status(201).json({ 
      message: 'Inventory added successfully', 
      inventory: newInventory 
    });
  } catch (err) {
    console.error('Inventory error:', err);
    
    // Check for MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'A record with this batch ID already exists',
        details: err.message
      });
    }
    
    res.status(400).json({ 
      error: 'Failed to add inventory', 
      details: err.message 
    });
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('processingBatchRef')
      .sort({ createdAt: -1 });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('processingBatchRef');
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('processingBatchRef');

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    res.json({ message: 'Inventory updated successfully', inventory });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update inventory', details: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    res.json({ message: 'Inventory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inventory' });
  }
};

