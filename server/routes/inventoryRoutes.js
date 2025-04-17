// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Create new inventory entry
router.post('/', inventoryController.addInventory);

// Get all inventory entries
router.get('/', inventoryController.getAllInventory);

// Get single inventory entry
router.get('/:id', inventoryController.getInventoryById);

// Update inventory entry
router.put('/:id', inventoryController.updateInventory);

// Add this route to your processing routes file
// Delete inventory entry
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;
