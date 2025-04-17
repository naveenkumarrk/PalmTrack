// routes/processingRoutes.js
const express = require('express');
const router = express.Router();
const processingController = require('../controllers/processingController');
const checkRole = require('../middlewares/checkRole');
const verifyToken = require('../middlewares/verifyToken');


// POST /api/processing/
router.post('/', processingController.createProcessingBatch);

// PATCH /api/processing/:batchId/stage
router.patch('/:batchId/stage', processingController.updateStage);

// PATCH /api/processing/:batchId/complete (Manager only)
router.patch('/:batchId/complete',verifyToken, checkRole('manager'), processingController.completeBatch);

// Add this to your processing routes file (e.g., routes/processingRoutes.js)
router.put('/:id/inventory-status', processingController.updateInventoryStatus);

router.get('/all', processingController.getAllBatches);

module.exports = router;
