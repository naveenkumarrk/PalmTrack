// controllers/neeraController.js
const Neera = require('../models/Neera');

exports.addNeera = async (req, res) => {
  try {
    console.log('Received neera data:', req.body);
    
    const {
      supplierName,
      collectionDate,
      batchId,
      quantityLiters,
      collectionMethod,
      storageTank,
      temperatureCelsius,
      notes
    } = req.body;

    // Validate required fields
    if (!supplierName || !collectionDate || !batchId || !quantityLiters) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Supplier name, collection date, batch ID, and quantity are required'
      });
    }

    // Check if batchId already exists
    const existingNeera = await Neera.findOne({ batchId });
    if (existingNeera) {
      return res.status(400).json({ 
        error: 'Duplicate batch ID',
        details: 'A neera collection with this batch ID already exists'
      });
    }

    const newNeera = new Neera({
      supplierName,
      collectionDate,
      batchId,
      quantityLiters,
      collectionMethod,
      storageTank,
      temperatureCelsius,
      notes
    });

    await newNeera.save();
    console.log('Neera saved successfully:', newNeera);
    
    res.status(201).json({ 
      message: 'Neera collection added successfully', 
      neera: newNeera 
    });
  } catch (err) {
    console.error('Error in addNeera:', err);
    res.status(400).json({ 
      error: 'Failed to add neera collection', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.getAllNeera = async (req, res) => {
  try {
    const neera = await Neera.find().sort({ collectionDate: -1 });
    res.json(neera);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch neera collections' });
  }
};

exports.getNeeraById = async (req, res) => {
  try {
    const neera = await Neera.findById(req.params.id);
    if (!neera) {
      return res.status(404).json({ error: 'Neera collection not found' });
    }
    res.json(neera);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch neera collection' });
  }
};

exports.updateNeera = async (req, res) => {
  try {
    const neera = await Neera.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!neera) {
      return res.status(404).json({ error: 'Neera collection not found' });
    }

    res.json({ message: 'Neera collection updated successfully', neera });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update neera collection', details: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updateFields = { status };
    if (status === 'Completed') {
      updateFields.isCompleted = true;
    }

    const neera = await Neera.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!neera) {
      return res.status(404).json({ error: 'Neera collection not found' });
    }

    res.json({ message: 'Status updated successfully', neera });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update status', details: err.message });
  }
};


// Delete a neera collection
exports.deleteNeera = async (req, res) => {
  try {
    const neera = await Neera.findByIdAndDelete(req.params.id);
    if (!neera) {
      return res.status(404).json({ error: 'Neera collection not found' });
    }
    res.json({ message: 'Neera collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting neera:', error);
    res.status(500).json({ 
      error: 'Failed to delete neera collection',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
