// routes/neeraRoutes.js
const express = require('express');
const router = express.Router();
const neeraController = require('../controllers/neeraController');

// Create new neera collection
router.post('/', neeraController.addNeera);

// Get all neera collections
router.get('/', neeraController.getAllNeera);

// Get single neera collection
router.get('/:id', neeraController.getNeeraById);

// Update neera collection
router.put('/:id', neeraController.updateNeera);

// Update neera status
router.put('/:id/status', neeraController.updateStatus);

// Delete neera collection
router.delete('/:id', neeraController.deleteNeera);

module.exports = router;
